import { useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import algosdk from "algosdk";
import { Wallet, Loader2, CheckCircle2, AlertCircle, CircleDollarSign } from "lucide-react";

interface PayWithAlgoProps {
  productId: string;
  priceAlgo: number;
  sellerUserId: string;
  productTitle: string;
}

type PaymentStatus = "idle" | "loading" | "success" | "error";
type PaymentMethod = "ALGO" | "USDC";

// USDC ASA ID on Algorand TestNet
const USDC_ASA_ID_TESTNET = 10458941;
const ALGORAND_TESTNET = "https://testnet-api.4160.nodely.dev";
const algodClient = new algosdk.Algodv2("", ALGORAND_TESTNET, "");

// Rough conversion: 1 ALGO ≈ 0.15 USDC (demo rate)
const ALGO_TO_USDC_RATE = 0.15;

const PayWithAlgo = ({ productId, priceAlgo, sellerUserId, productTitle }: PayWithAlgoProps) => {
  const { accountAddress, connectWallet, signAndSendPayment } = useWallet();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState<PaymentStatus>("idle");
  const [txId, setTxId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [method, setMethod] = useState<PaymentMethod>("ALGO");

  const priceUsdc = parseFloat((priceAlgo * ALGO_TO_USDC_RATE).toFixed(2));

  const handlePay = async () => {
    if (!user) return navigate("/auth");

    if (!accountAddress) {
      await connectWallet();
      return;
    }

    setStatus("loading");
    setError(null);

    try {
      // Get seller's wallet address
      const { data: sellerProfile, error: profileErr } = await supabase
        .from("profiles")
        .select("wallet_address")
        .eq("id", sellerUserId)
        .single();

      const sellerAddress = (sellerProfile as any)?.wallet_address;

      if (profileErr || !sellerAddress) {
        throw new Error("Seller has not connected a wallet yet. Payment cannot proceed.");
      }

      if (method === "ALGO") {
        const result = await signAndSendPayment(
          sellerAddress,
          priceAlgo,
          `CampusMarket: ${productTitle} (${productId})`,
        );
        setTxId(result.txId);
      } else {
        // USDC (ASA) transfer
        const suggestedParams = await algodClient.getTransactionParams().do();
        // USDC has 6 decimals on Algorand
        const usdcMicroAmount = Math.round(priceUsdc * 1_000_000);

        const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
          sender: accountAddress,
          receiver: sellerAddress,
          amount: usdcMicroAmount,
          assetIndex: USDC_ASA_ID_TESTNET,
          note: new TextEncoder().encode(`CampusMarket USDC: ${productTitle} (${productId})`),
          suggestedParams,
        });

        // Use the wallet's signAndSend for ASA txns too
        const result = await signAndSendPayment(
          sellerAddress,
          priceAlgo,
          `CampusMarket USDC: ${productTitle} (${productId})`,
          { assetIndex: USDC_ASA_ID_TESTNET, usdcAmount: usdcMicroAmount },
        );
        setTxId(result.txId);
      }

      setStatus("success");
    } catch (err: any) {
      setError(err.message || "Payment failed. Please try again.");
      setStatus("error");
    }
  };

  return (
    <div className="bg-card rounded-3xl p-6 shadow-card border border-border/50">
      <h2 className="text-lg font-extrabold text-foreground flex items-center gap-2 mb-4">
        <Wallet className="w-5 h-5 text-secondary" /> Pay with Crypto
      </h2>

      {/* Payment method toggle */}
      <div className="flex gap-2 mb-5">
        <button
          onClick={() => setMethod("ALGO")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold border transition-all ${
            method === "ALGO"
              ? "bg-secondary/10 border-secondary text-secondary shadow-sm"
              : "bg-accent/50 border-border/60 text-muted-foreground hover:bg-accent"
          }`}
        >
          <Wallet className="w-4 h-4" /> ALGO
        </button>
        <button
          onClick={() => setMethod("USDC")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold border transition-all ${
            method === "USDC"
              ? "bg-primary/10 border-primary text-primary shadow-sm"
              : "bg-accent/50 border-border/60 text-muted-foreground hover:bg-accent"
          }`}
        >
          <CircleDollarSign className="w-4 h-4" /> USDC
        </button>
      </div>

      {/* Price display */}
      <div className="flex items-baseline gap-3 mb-4">
        {method === "ALGO" ? (
          <>
            <span className="text-2xl font-black text-foreground">{priceAlgo} ALGO</span>
            <span className="text-sm text-muted-foreground">≈ ${priceUsdc} USDC</span>
          </>
        ) : (
          <>
            <span className="text-2xl font-black text-foreground">${priceUsdc} USDC</span>
            <span className="text-sm text-muted-foreground">≈ {priceAlgo} ALGO</span>
          </>
        )}
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-secondary/10 text-secondary">TestNet</span>
      </div>

      {status === "idle" && (
        <button
          onClick={handlePay}
          className={`w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold hover:scale-[1.01] transition-all ${
            method === "ALGO"
              ? "bg-gradient-to-r from-secondary to-[hsl(230,70%,55%)] text-secondary-foreground hover:shadow-glow-blue"
              : "bg-gradient-to-r from-primary to-[hsl(170,55%,38%)] text-primary-foreground hover:shadow-glow-green"
          }`}
        >
          {method === "ALGO" ? <Wallet className="w-4 h-4" /> : <CircleDollarSign className="w-4 h-4" />}
          {accountAddress ? `Pay with ${method}` : `Connect Wallet & Pay`}
        </button>
      )}

      {status === "loading" && (
        <div className="w-full flex items-center justify-center gap-2 bg-muted text-muted-foreground px-6 py-3.5 rounded-xl text-sm font-semibold">
          <Loader2 className="w-4 h-4 animate-spin" /> Signing & submitting {method} transaction…
        </div>
      )}

      {status === "success" && txId && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-primary font-semibold">
            <CheckCircle2 className="w-5 h-5" /> {method} Payment Successful!
          </div>
          <a
            href={`https://testnet.explorer.perawallet.app/tx/${txId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-sm text-secondary hover:underline break-all"
          >
            View on Explorer: {txId.slice(0, 16)}…
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
