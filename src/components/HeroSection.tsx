import heroBg from "@/assets/hero-bg.png";
import { ArrowRight, Sparkles } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center bottom",
        }}
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[hsl(214,85%,45%,0.8)] via-[hsl(214,80%,50%,0.6)] to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[hsl(214,85%,45%,0.3)] to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 flex items-center gap-8">
        {/* Left Content */}
        <div className="flex-1 space-y-6">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 shadow-soft border border-[hsl(0,0%,100%,0.3)]">
            <Sparkles className="w-4 h-4 text-warning" />
            <span className="text-sm font-semibold text-foreground">Campus Crypto Marketplace</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-black leading-[1.1] text-[hsl(0,0%,100%)] drop-shadow-lg">
            Buy & Sell on<br />
            Campus with<br />
            Crypto <span className="inline-block text-warning">⚡</span>
          </h1>

          <p className="text-xl font-medium text-[hsl(0,0%,100%,0.9)] max-w-sm">
            Instant. Secure. Student-to-Student.
          </p>

          <div className="flex items-center gap-4 pt-2">
            <button className="flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-xl text-sm font-bold hover:scale-105 transition-all shadow-glow-green">
              Browse Items <ArrowRight className="w-4 h-4" />
            </button>
            <button className="flex items-center gap-2 glass-strong text-foreground border border-[hsl(0,0%,100%,0.4)] px-8 py-4 rounded-xl text-sm font-bold hover:scale-105 transition-all shadow-soft">
              Sell an Item
            </button>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex-1 flex flex-col items-center gap-5">
          {/* Now Accepting Badge */}
          <div className="glass-strong rounded-2xl px-6 py-4 shadow-card border border-[hsl(0,0%,100%,0.3)] flex items-center gap-4">
            <span className="text-base font-semibold text-foreground">Now accepting</span>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-bold text-sm shadow-glow-blue">A</div>
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm shadow-glow-green">$</div>
            </div>
            <div>
              <span className="font-extrabold text-foreground text-xl">Algo</span>
              <span className="text-foreground font-medium"> & </span>
              <span className="font-extrabold text-foreground text-xl">USDC</span>
            </div>
          </div>

        </div>
      </div>

      {/* Decorative wave bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 60V30C240 5 480 5 720 30C960 55 1200 55 1440 30V60H0Z" fill="hsl(214, 100%, 97%)" />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
