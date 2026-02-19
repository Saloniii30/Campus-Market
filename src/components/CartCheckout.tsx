import { useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useNavigate } from "react-router-dom";
import { Wallet, CircleDollarSign, Loader2, CheckCircle2, AlertCircle, X, ShieldCheck } from "lucide-react";

type PaymentMethod = "ALGO" | "USDC";
type CheckoutStatus = "idle" | "loading" | "success" | "error";

const ALGO_TO_USDC_RATE = 0.15;

const CartCheckout = ({ totalAlgo, onClose }: { totalAlgo: number; onClose: () => void }) => {
  const { accountAddress, connectWallet, isConnecting } = useWallet();
  const { user } = useAuth();
  const { clearCart } = useCart();
  const navigate = useNavigate();
  const [method, setMethod] = useState<PaymentMethod>("ALGO");
  const [status, setStatus] = useState<CheckoutStatus>("idle");
  const [txId, setTxId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const priceUsdc = parseFloat((totalAlgo * ALGO_TO_USDC_RATE).toFixed(2));

  const handleConnect = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    await connectWallet();
  };

  const handlePay = async () => {
    setStatus("loading");
    setError(null);
    try {
      // For demo/testnet: we simulate a successful checkout
      // In production, you'd iterate cart items and pay each seller
      await new Promise((r) => setTimeout(r, 2000));
      setTxId("DEMO_TX_" + Date.now().toString(36).toUpperCase());
      setStatus("success");
      clearCart();
    } catch (err: any) {
      setError(err.message || "Payment failed. Please try again.");
      setStatus("error");
    }
  };

  return (
    <div className="mt-6 p-6 rounded-2xl border border-secondary/30 bg-secondary/5 space-y-5 animate-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-extrabold text-foreground flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-primary" /> Secure Checkout
        </h3>
        <button onClick={onClose} className="w-8 h-8 rounded-full bg-accent flex items-center justify-center hover:bg-muted transition-colors">
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Step 1: Connect Wallet */}
      {!accountAddress ? (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Connect your wallet to proceed with payment.</p>

          <div className="flex gap-3">
            <div className="flex-1 bg-accent/60 rounded-xl px-4 py-3 border border-border/50 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-secondary to-[hsl(230,70%,55%)] flex items-center justify-center shrink-0">
                <Wallet className="w-5 h-5 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">ALGO</p>
                <p className="text-xs text-muted-foreground">Native token</p>
              </div>
            </div>
            <div className="flex-1 bg-accent/60 rounded-xl px-4 py-3 border border-border/50 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-[hsl(170,55%,38%)] flex items-center justify-center shrink-0">
                <CircleDollarSign className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">USDC</p>
                <p className="text-xs text-muted-foreground">Stablecoin</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-secondary to-[hsl(230,70%,55%)] text-secondary-foreground px-6 py-3.5 rounded-xl text-sm font-bold hover:shadow-glow-blue hover:scale-[1.01] transition-all disabled:opacity-60"
          >
            <Wallet className="w-4 h-4" />
            {isConnecting ? "Connecting…" : "Connect Wallet"}
          </button>
          <p className="text-xs text-center text-muted-foreground">
            🔒 Works with Pera Wallet, Trust Wallet & other WalletConnect wallets
          </p>
        </div>
      ) : status === "success" ? (
        /* Success state */
        <div className="space-y-4 text-center py-4">
          <CheckCircle2 className="w-12 h-12 text-primary mx-auto" />
          <div>
            <p className="text-lg font-bold text-foreground">Payment Successful!</p>
            <p className="text-sm text-muted-foreground mt-1">Your order has been placed.</p>
          </div>
          {txId && (
            <p className="text-xs font-mono text-muted-foreground break-all">TX: {txId}</p>
          )}
          <button
            onClick={() => navigate("/")}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-xl text-sm font-bold hover:shadow-glow-green transition-all"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        /* Step 2: Choose method & pay */
        <div className="space-y-4">
          <div className="bg-primary/5 border border-primary/20 rounded-xl px-4 py-2.5 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
            <span className="text-sm font-semibold text-primary">Wallet Connected</span>
            <span className="text-xs font-mono text-muted-foreground ml-auto">
              {accountAddress.slice(0, 4)}…{accountAddress.slice(-4)}
            </span>
          </div>

          {/* Payment method toggle */}
          <div className="flex gap-2">
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

          {/* Total */}
          <div className="flex items-baseline gap-3">
            {method === "ALGO" ? (
              <>
                <span className="text-2xl font-black text-foreground">{totalAlgo.toFixed(2)} ALGO</span>
                <span className="text-sm text-muted-foreground">≈ ${priceUsdc} USDC</span>
              </>
            ) : (
              <>
                <span className="text-2xl font-black text-foreground">${priceUsdc} USDC</span>
                <span className="text-sm text-muted-foreground">≈ {totalAlgo.toFixed(2)} ALGO</span>
              </>
            )}
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-secondary/10 text-secondary">TestNet</span>
          </div>

          {/* Pay button */}
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
              Pay {method === "ALGO" ? `${totalAlgo.toFixed(2)} ALGO` : `$${priceUsdc} USDC`}
            </button>
          )}

          {status === "loading" && (
            <div className="w-full flex items-center justify-center gap-2 bg-muted text-muted-foreground px-6 py-3.5 rounded-xl text-sm font-semibold">
              <Loader2 className="w-4 h-4 animate-spin" /> Processing {method} payment…
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

          <p className="text-xs text-center text-muted-foreground">
            🔗 Blockchain verified · ⚡ Instant settlement · 💸 No platform fees
          </p>
        </div>
      )}
    </div>
  );
};

export default CartCheckout;
