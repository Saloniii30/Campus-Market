import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FiltersSidebar from "@/components/FiltersSidebar";
import ProductGrid from "@/components/ProductGrid";
import CheckoutInfo from "@/components/CheckoutInfo";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <div className="pt-4">
        <Navbar />
      </div>

      {/* Hero */}
      <HeroSection />

      {/* Main Content: Sidebar + Products */}
      <main className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex gap-8">
          <FiltersSidebar />
          <ProductGrid />
        </div>
      </main>

      {/* Checkout Info */}
      <CheckoutInfo />

      {/* Footer */}
      <footer className="text-center py-8 text-xs text-muted-foreground">
        © 2026 CampusMarket. Built for students, powered by blockchain.
      </footer>
    </div>
  );
};

export default Index;
