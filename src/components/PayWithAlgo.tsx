import { useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import algosdk from "algosdk";
import { Wallet, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface PayWithAlgoProps {
  productId: string;
  priceAlgo: number;
  sellerUserId: string;
  productTitle: string;
}

type PaymentStatus = "idle" | "loading" | "success" | "error";

const ALGORAND_TESTNET = "https://testnet-api.4160.nodely.dev";

const PayWithAlgo = ({ productId, priceAlgo, sellerUserId, productTitle }: PayWithAlgoProps) => {
  const { accountAddress, connectWallet, peraWallet } = useWallet();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState<PaymentStatus>("idle");
  const [txId, setTxId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePay = async () => {
    if (!user) return navigate("/auth");

    if (!accountAddress) {
      await connectWallet();
      return;
    }

    setStatus("loading");
    setError(null);

    try {
      // 1. Get seller's wallet address from their profile
      const { data: sellerProfile, error: profileErr } = await supabase
        .from("profiles")
        .select("wallet_address")
        .eq("id", sellerUserId)
        .single();

      if (profileErr || !(sellerProfile as any)?.wallet_address) {
        throw new Error("Seller has not connected a wallet yet. Payment cannot proceed.");
      }

      const sellerAddress = (sellerProfile as any).wallet_address as string;

      // 2. Get suggested params from Algorand testnet
      const algodClient = new algosdk.Algodv2("", ALGORAND_TESTNET, "");
      const suggestedParams = await algodClient.getTransactionParams().do();

      // 3. Create payment transaction (price in ALGO → microAlgos)
      const microAlgos = Math.round(priceAlgo * 1_000_000);

      const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        sender: accountAddress,
        receiver: sellerAddress,
        amount: microAlgos,
        note: new TextEncoder().encode(`CampusMarket: ${productTitle} (${productId})`),
        suggestedParams,
      });

      // 4. Sign with Pera Wallet
      const signedTxns = await peraWallet.signTransaction([
        [{ txn, signers: [accountAddress] }],
      ]);

      // 5. Submit to network
      const { txid } = await algodClient.sendRawTransaction(signedTxns[0]).do();
      setTxId(txid as string);
      setStatus("success");
    } catch (err: any) {
      console.error("Payment error:", err);
      if (err?.data?.type === "SIGN_TXN_CANCELLED" || err?.message?.includes("cancelled")) {
        setStatus("idle");
        return;
      }
      setError(err.message || "Payment failed. Please try again.");
      setStatus("error");
    }
  };

  return (
    <div className="bg-card rounded-3xl p-6 shadow-card border border-border/50">
      <h2 className="text-lg font-extrabold text-foreground flex items-center gap-2 mb-4">
        <Wallet className="w-5 h-5 text-secondary" /> Pay with ALGO
      </h2>

      <div className="flex items-baseline gap-3 mb-4">
        <span className="text-2xl font-black text-foreground">{priceAlgo} ALGO</span>
        <span className="text-sm text-muted-foreground">via Algorand TestNet</span>
      </div>

      {status === "idle" && (
        <button
          onClick={handlePay}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-secondary to-[hsl(230,70%,55%)] text-secondary-foreground px-6 py-3.5 rounded-xl text-sm font-bold hover:shadow-glow-blue hover:scale-[1.01] transition-all"
        >
          <Wallet className="w-4 h-4" />
          {accountAddress ? "Pay Now" : "Connect Wallet & Pay"}
        </button>
      )}

      {status === "loading" && (
        <div className="w-full flex items-center justify-center gap-2 bg-muted text-muted-foreground px-6 py-3.5 rounded-xl text-sm font-semibold">
          <Loader2 className="w-4 h-4 animate-spin" /> Waiting for wallet approval…
        </div>
      )}

      {status === "success" && txId && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-primary font-semibold">
            <CheckCircle2 className="w-5 h-5" /> Payment Successful!
          </div>
          <a
            href={`https://testnet.explorer.perawallet.app/tx/${txId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-sm text-secondary hover:underline break-all"
          >
            View transaction: {txId.slice(0, 12)}…
          </a>
          <button
            onClick={() => { setStatus("idle"); setTxId(null); }}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Make another payment
          </button>
        </div>
      )}

      {status === "error" && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-destructive font-semibold text-sm">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
          <button
            onClick={() => { setStatus("idle"); setError(null); }}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Try again
          </button>
        </div>
      )}

      <p className="mt-4 text-xs text-muted-foreground">
        🔗 Blockchain verified · ⚡ Instant settlement · 💸 No platform fees
      </p>
    </div>
  );
};

export default PayWithAlgo;
