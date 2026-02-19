import { Wallet, CreditCard, CheckCircle2, Shield } from "lucide-react";

const steps = [
  {
    icon: Wallet,
    title: "Connect Wallet",
    description: "Link your Algorand wallet in one click",
  },
  {
    icon: CreditCard,
    title: "Pay with ALGO or USDC",
    description: "Choose your preferred cryptocurrency",
  },
  {
    icon: CheckCircle2,
    title: "Transaction Confirmed",
    description: "Instant confirmation on blockchain",
  },
];

const CheckoutInfo = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="bg-card rounded-3xl p-10 shadow-card text-center">
        <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
          <Shield className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">Secure & Transparent</span>
        </div>

        <h2 className="text-3xl font-bold text-foreground mb-2">Easy Crypto Checkout</h2>
        <p className="text-muted-foreground mb-10">Three simple steps to complete your purchase</p>

        {/* Steps */}
        <div className="flex items-start justify-center gap-8 max-w-3xl mx-auto">
          {steps.map((step, i) => (
            <div key={step.title} className="flex-1 flex flex-col items-center text-center relative">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="absolute top-7 left-[60%] w-[80%] h-[2px] bg-border" />
              )}
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 relative z-10">
                <step.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground text-sm mb-1">{step.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex items-center justify-center gap-6 text-xs text-muted-foreground">
          <span>🔗 Blockchain Verified</span>
          <span>•</span>
          <span>💸 No Platform Fees</span>
          <span>•</span>
          <span>⚡ Instant Payments</span>
        </div>
      </div>
    </section>
  );
};

export default CheckoutInfo;
