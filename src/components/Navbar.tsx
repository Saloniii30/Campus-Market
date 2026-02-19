import { Search, ShoppingBag, LayoutDashboard, ChevronDown, Wallet, LogIn, LogOut, PlusCircle, Unplug } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useWallet } from "@/hooks/useWallet";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  onSearchChange?: (query: string) => void;
}

const Navbar = ({ onSearchChange }: NavbarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { user, signOut } = useAuth();
  const { accountAddress, isConnecting, connectWallet, disconnectWallet } = useWallet();
  const navigate = useNavigate();

  const handleSearch = (val: string) => {
    setSearchQuery(val);
    onSearchChange?.(val);
  };

  const shortAddr = accountAddress
    ? `${accountAddress.slice(0, 4)}...${accountAddress.slice(-4)}`
    : null;

  return (
    <nav className="sticky top-0 z-50 glass-strong border-b border-border/50 shadow-navbar">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-4">
        <div className="flex items-center gap-2.5 shrink-0 cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-[hsl(170,55%,38%)] flex items-center justify-center shadow-glow-green">
            <ShoppingBag className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-extrabold text-xl text-foreground tracking-tight">CampusMarket</span>
        </div>

        <div className="flex-1 max-w-lg mx-4">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-muted-foreground" />
            <input type="text" placeholder="Search for items..." value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-32 py-3 rounded-xl bg-accent/70 border border-border/60 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary/40 transition-all" />
            <button className="absolute right-1.5 flex items-center gap-1.5 text-sm font-semibold text-foreground bg-card px-3.5 py-2 rounded-lg border border-border/60 hover:bg-muted hover:shadow-soft transition-all">
              Categories <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          {user ? (
            <>
              <button onClick={() => navigate("/sell")} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5">
                <PlusCircle className="w-4 h-4" /> Sell Item
              </button>
              <button onClick={() => navigate("/dashboard")} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5">
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </button>
              <button onClick={() => signOut()} className="text-sm font-semibold text-destructive/70 hover:text-destructive transition-colors flex items-center gap-1.5">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </>
          ) : (
            <button onClick={() => navigate("/auth")} className="flex items-center gap-2 bg-gradient-to-r from-primary to-[hsl(170,55%,38%)] text-primary-foreground px-6 py-3 rounded-xl text-sm font-bold hover:shadow-glow-green hover:scale-[1.02] transition-all">
              <LogIn className="w-4 h-4" /> Sign In
            </button>
          )}

          <button
            disabled
            className="flex items-center gap-2 bg-gradient-to-r from-secondary to-[hsl(230,70%,55%)] text-secondary-foreground px-5 py-3 rounded-xl text-sm font-bold opacity-60 cursor-not-allowed"
            title="Wallet connect coming soon"
          >
            <Wallet className="w-4 h-4" /> Connect Wallet
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
