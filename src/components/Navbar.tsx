import { Search, ShoppingBag, LayoutDashboard, ChevronDown, Wallet } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <nav className="sticky top-0 z-50 bg-card border-b-2 border-secondary px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl text-foreground">CampusMarket</span>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-lg mx-4">
          <div className="relative flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search for items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-28 py-2.5 rounded-lg bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/40 transition-all"
            />
            <button className="absolute right-1 flex items-center gap-1 text-sm font-medium text-foreground bg-card px-3 py-1.5 rounded-md border border-border hover:bg-muted transition-colors">
              Categories <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Nav Links */}
        <div className="flex items-center gap-5 shrink-0">
          <a href="#" className="text-sm font-medium text-foreground hover:text-secondary transition-colors">
            Sell Item
          </a>
          <a href="#" className="text-sm font-medium text-foreground hover:text-secondary transition-colors">
            Dashboard
          </a>
          <button className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
            <Wallet className="w-4 h-4" /> Connect Wallet
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
