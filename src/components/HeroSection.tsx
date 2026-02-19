import heroIllustration from "@/assets/hero-illustration.png";
import { ArrowRight, Zap } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="hero-gradient py-16 px-4 mt-6">
      <div className="max-w-7xl mx-auto flex items-center gap-12">
        {/* Left Content */}
        <div className="flex-1 space-y-6">
          <div className="inline-flex items-center gap-2 bg-card/80 backdrop-blur px-4 py-2 rounded-full shadow-soft text-sm font-medium text-foreground">
            <Zap className="w-4 h-4 text-warning" />
            Now accepting Algo & USDC
          </div>

          <h1 className="text-5xl font-extrabold leading-tight text-foreground">
            Buy & Sell on Campus<br />
            with Crypto <span className="inline-block">⚡</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-md">
            Instant. Secure. Student-to-Student. The easiest way to trade on campus using cryptocurrency.
          </p>

          <div className="flex items-center gap-4 pt-2">
            <button className="flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3.5 rounded-full text-sm font-semibold hover:opacity-90 transition-all shadow-soft">
              Browse Items <ArrowRight className="w-4 h-4" />
            </button>
            <button className="flex items-center gap-2 bg-card text-foreground border border-border px-7 py-3.5 rounded-full text-sm font-semibold hover:bg-accent transition-all shadow-soft">
              Sell an Item
            </button>
          </div>
        </div>

        {/* Right Illustration */}
        <div className="flex-1 flex justify-center">
          <img
            src={heroIllustration}
            alt="Student with laptop"
            className="w-[420px] h-auto animate-float drop-shadow-xl"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
