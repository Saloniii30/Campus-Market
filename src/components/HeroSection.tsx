import heroIllustration from "@/assets/hero-illustration.png";
import heroBg from "@/assets/hero-bg.png";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section
      className="relative py-12 px-4 mt-2 overflow-hidden"
      style={{
        backgroundImage: `url(${heroBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-secondary/70 via-secondary/40 to-transparent" />

      <div className="max-w-7xl mx-auto flex items-center gap-8 relative z-10">
        {/* Left Content */}
        <div className="flex-1 space-y-5">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-card">
            Buy & Sell on Campus{" "}
            <span className="whitespace-nowrap">
              with Crypto <span className="inline-block">⚡</span>
            </span>
          </h1>

          <p className="text-lg font-medium text-card/90">
            Instant. Secure. Student-to-Student.
          </p>

          <div className="flex items-center gap-4 pt-2">
            <button className="flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-all shadow-soft">
              Browse Items <ArrowRight className="w-4 h-4" />
            </button>
            <button className="flex items-center gap-2 bg-card text-primary border-2 border-primary px-7 py-3.5 rounded-lg text-sm font-semibold hover:bg-primary/5 transition-all shadow-soft">
              Sell an Item
            </button>
          </div>
        </div>

        {/* Right Side: Badge + Illustration */}
        <div className="flex-1 flex flex-col items-center gap-4">
          {/* Now Accepting badge */}
          <div className="bg-card/90 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-card flex items-center gap-3">
            <span className="text-base font-semibold text-foreground">Now accepting</span>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-bold text-xs">A</div>
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs">$</div>
            </div>
            <div>
              <span className="font-bold text-foreground text-lg">Algo</span>
              <span className="text-foreground"> & </span>
              <span className="font-bold text-foreground text-lg">USDC</span>
            </div>
          </div>

          <img
            src={heroIllustration}
            alt="Student with laptop"
            className="w-[320px] h-auto animate-float drop-shadow-xl"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
