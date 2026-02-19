import { useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import { Wallet, X, CircleDollarSign, CheckCircle2, Copy, Check, ExternalLink } from "lucide-react";

interface WalletModalProps {
  open: boolean;
  onClose: () => void;
}

const WalletModal = ({ open, onClose }: WalletModalProps) => {
  const { accountAddress, isConnecting, connectWallet, disconnectWallet } = useWallet();
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  const handleCopy = () => {
    if (accountAddress) {
      navigator.clipboard.writeText(accountAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleConnect = async () => {
    await connectWallet();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 bg-card rounded-3xl shadow-card-hover border border-border/50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-3">
          <h2 className="text-xl font-extrabold text-foreground flex items-center gap-2">
            <Wallet className="w-5 h-5 text-secondary" /> Wallet Connect
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-accent flex items-center justify-center hover:bg-muted transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <div className="px-6 pb-6 space-y-5">
          {!accountAddress ? (
            /* Not connected state */
            <>
              <p className="text-sm text-muted-foreground">
                Generate an Algorand wallet instantly in your browser. No app or extension needed.
              </p>

              {/* Payment methods preview */}
              <div className="space-y-2.5">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Supported payments</p>
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
              </div>

              <button
                onClick={handleConnect}
                disabled={isConnecting}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-secondary to-[hsl(230,70%,55%)] text-secondary-foreground px-6 py-3.5 rounded-xl text-sm font-bold hover:shadow-glow-blue hover:scale-[1.01] transition-all disabled:opacity-60"
              >
                <Wallet className="w-4 h-4" />
                {isConnecting ? "Generating Wallet…" : "Generate & Connect Wallet"}
              </button>

              <p className="text-xs text-center text-muted-foreground">
                🔒 Your keys are stored securely in your browser
              </p>
            </>
          ) : (
            /* Connected state */
            <>
              <div className="bg-primary/5 border border-primary/20 rounded-xl px-4 py-3 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm font-semibold text-primary">Wallet Connected</span>
              </div>

              {/* Address */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Your Address</p>
                <div className="bg-accent/60 rounded-xl px-4 py-3 border border-border/50 flex items-center gap-2">
                  <span className="text-xs font-mono text-foreground truncate flex-1">{accountAddress}</span>
                  <button onClick={handleCopy} className="shrink-0 w-8 h-8 rounded-lg bg-card flex items-center justify-center hover:bg-muted transition-colors border border-border/50">
                    {copied ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
                  </button>
                </div>
              </div>

              {/* Payment options */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Pay with</p>
                <div className="space-y-2">
                  <div className="bg-accent/60 rounded-xl px-4 py-3.5 border border-border/50 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-secondary to-[hsl(230,70%,55%)] flex items-center justify-center shrink-0">
                      <Wallet className="w-5 h-5 text-secondary-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-foreground">ALGO</p>
                      <p className="text-xs text-muted-foreground">Native Algorand token</p>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  </div>
                  <div className="bg-accent/60 rounded-xl px-4 py-3.5 border border-border/50 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-[hsl(170,55%,38%)] flex items-center justify-center shrink-0">
                      <CircleDollarSign className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-foreground">USDC</p>
                      <p className="text-xs text-muted-foreground">USD Stablecoin on Algorand</p>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  </div>
                </div>
              </div>

              <p className="text-xs text-center text-muted-foreground">
                Browse products and use <strong>Pay with ALGO</strong> or <strong>USDC</strong> on any listing
              </p>

              <div className="flex gap-3">
                <a
                  href="https://bank.testnet.algorand.network/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 bg-accent border border-border/50 text-foreground px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-muted transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Fund TestNet
                </a>
                <button
                  onClick={() => { disconnectWallet(); onClose(); }}
                  className="flex-1 bg-destructive/10 text-destructive px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-destructive/20 transition-all"
                >
                  Disconnect
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WalletModal;
