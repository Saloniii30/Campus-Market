import { Wallet, CircleDollarSign, CheckCircle2, ArrowRight, Shield } from "lucide-react";

const steps = [
  {
    icon: Wallet,
    title: "Connect Wallet",
    desc: "Link your Algorand wallet",
    gradient: "from-[hsl(214,80%,55%)] to-[hsl(230,70%,55%)]",
  },
  {
    icon: CircleDollarSign,
    title: "Pay with ALGO or USDC",
    desc: "Choose your cryptocurrency",
    gradient: "from-[hsl(152,60%,42%)] to-[hsl(170,55%,38%)]",
  },
  {
    icon: CheckCircle2,
    title: "Transaction Confirmed",
    desc: "Instant on-chain confirmation",
    gradient: "from-[hsl(152,60%,42%)] to-[hsl(140,60%,38%)]",
  },
];

const CheckoutInfo = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="relative bg-card rounded-3xl px-10 py-10 shadow-card border border-border/50 overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[hsl(214,80%,92%,0.5)] rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[hsl(152,60%,85%,0.5)] rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-[hsl(152,60%,42%,0.1)] px-4 py-2 rounded-full mb-3">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Secure & Transparent</span>
            </div>
            <h2 className="text-3xl font-extrabold text-foreground">Easy Crypto Checkout</h2>
            <p className="text-muted-foreground mt-1">Three simple steps to complete your purchase</p>
          </div>

          {/* Steps */}
          <div className="flex items-center justify-center gap-6 max-w-3xl mx-auto">
            {steps.map((step, i) => (
              <div key={step.title} className="flex items-center gap-6">
                <div className="flex items-center gap-4 bg-accent/60 rounded-2xl px-5 py-4 border border-border/50 hover:shadow-soft transition-all hover:scale-[1.02]">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-sm shrink-0`}>
                    <step.icon className="w-6 h-6 text-[hsl(0,0%,100%)]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-foreground">{step.title}</h3>
                    <p className="text-xs text-muted-foreground">{step.desc}</p>
                  </div>
                </div>
                {i < steps.length - 1 && (
                  <div className="shrink-0 w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-secondary" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">🔗 Blockchain Verified</span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span className="flex items-center gap-1.5">💸 No Platform Fees</span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span className="flex items-center gap-1.5">⚡ Instant Payments</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckoutInfo;
