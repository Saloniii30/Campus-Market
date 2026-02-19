import { Wallet, CircleDollarSign, CheckCircle2, ArrowRight } from "lucide-react";

const steps = [
  { icon: Wallet, title: "Connect Wallet", color: "bg-secondary" },
  { icon: CircleDollarSign, title: "Pay with ALGO or USDC", color: "bg-primary" },
  { icon: CheckCircle2, title: "Transaction Confirmed", color: "bg-primary" },
];

const CheckoutInfo = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="bg-card rounded-2xl px-8 py-6 shadow-card">
        <h2 className="text-xl font-bold italic text-foreground mb-6">Easy Crypto Checkout</h2>

        {/* Horizontal steps with arrows */}
        <div className="flex items-center justify-center gap-4">
          {steps.map((step, i) => (
            <div key={step.title} className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${step.color} flex items-center justify-center`}>
                  <step.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-semibold text-sm text-foreground">{step.title}</span>
              </div>
              {i < steps.length - 1 && (
                <ArrowRight className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <span>Blockchain Verified</span>
          <span>•</span>
          <span>No Platform Fees</span>
          <span>•</span>
          <span>Instant Payments</span>
        </div>
      </div>
    </section>
  );
};

export default CheckoutInfo;
