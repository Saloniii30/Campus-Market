import { Search, ShoppingBag, LayoutDashboard, ChevronDown, Wallet } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <nav className="sticky top-4 z-50 mx-auto max-w-7xl px-4">
      <div className="rounded-2xl bg-card px-6 py-3 shadow-navbar flex items-center gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg text-foreground">CampusMarket</span>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-xl mx-auto">
          <div className="relative flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search for items…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-accent border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            />
            <button className="absolute right-2 flex items-center gap-1 text-xs text-muted-foreground bg-card px-2.5 py-1 rounded-lg border border-border hover:bg-muted transition-colors">
              Categories <ChevronDown className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Nav Links */}
        <div className="flex items-center gap-6 shrink-0">
          <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5">
            <ShoppingBag className="w-4 h-4" /> Sell Item
          </a>
          <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5">
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </a>
          <button className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity">
            <Wallet className="w-4 h-4" /> Connect Wallet
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
