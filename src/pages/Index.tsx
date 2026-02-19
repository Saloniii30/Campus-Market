import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FiltersSidebar from "@/components/FiltersSidebar";
import ProductGrid from "@/components/ProductGrid";
import CheckoutInfo from "@/components/CheckoutInfo";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />

      {/* Main Content: Sidebar + Products */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-6">
          <FiltersSidebar />
          <ProductGrid />
        </div>
      </main>

      <CheckoutInfo />

      <footer className="text-center py-6 text-xs text-muted-foreground">
        Blockchain Verified • No Platform Fees • Instant Payments
      </footer>
    </div>
  );
};

export default Index;
