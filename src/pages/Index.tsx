import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FiltersSidebar from "@/components/FiltersSidebar";
import ProductGrid from "@/components/ProductGrid";
import CheckoutInfo from "@/components/CheckoutInfo";
import { ShoppingBag } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background bg-mesh">
      <Navbar />
      <HeroSection />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex gap-6">
          <FiltersSidebar />
          <ProductGrid />
        </div>
      </main>

      <CheckoutInfo />

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-8 border-t border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-[hsl(170,55%,38%)] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">CampusMarket</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © 2026 CampusMarket. Built for students, powered by blockchain.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
