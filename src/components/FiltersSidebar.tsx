import { Book, Monitor, Armchair, Sparkles } from "lucide-react";
import { useState } from "react";

const categories = [
  { name: "All", icon: Sparkles, color: "from-[hsl(214,80%,55%)] to-[hsl(230,70%,55%)]" },
  { name: "Books", icon: Book, color: "from-[hsl(152,60%,42%)] to-[hsl(170,60%,38%)]" },
  { name: "Electronics", icon: Monitor, color: "from-[hsl(38,92%,50%)] to-[hsl(28,92%,50%)]" },
  { name: "Furniture", icon: Armchair, color: "from-[hsl(0,84%,60%)] to-[hsl(350,84%,55%)]" },
];

interface FiltersSidebarProps {
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  priceRange: number;
  onPriceRangeChange: (val: number) => void;
}

const FiltersSidebar = ({ selectedCategory, onCategoryChange, priceRange, onPriceRangeChange }: FiltersSidebarProps) => {
  const [cryptoFilters, setCryptoFilters] = useState({ algo: true, usdc: false });

  return (
    <aside className="w-60 shrink-0 space-y-4">
      <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[hsl(214,80%,92%)] to-transparent rounded-bl-full" />
        <h3 className="font-bold text-foreground mb-5 flex items-center gap-2 relative">
          <Sparkles className="w-4 h-4 text-secondary" /> Categories
        </h3>
        <div className="space-y-2.5 relative">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => onCategoryChange(cat.name)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all hover:scale-[1.02] ${
                selectedCategory === cat.name ? "bg-accent shadow-soft" : "hover:bg-accent/50"
              }`}
            >
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-sm`}>
                <cat.icon className="w-4 h-4 text-[hsl(0,0%,100%)]" />
              </div>
              <span className={`font-medium ${selectedCategory === cat.name ? "text-foreground" : "text-muted-foreground"}`}>
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50">
        <h3 className="font-bold text-foreground mb-4">Price Range</h3>
        <div className="space-y-3">
          <input type="range" min={0} max={100000} step={500} value={priceRange}
            onChange={(e) => onPriceRangeChange(Number(e.target.value))}
            className="w-full accent-secondary h-2 rounded-full" />
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground bg-accent px-2 py-1 rounded-md">₹0</span>
            <span className="text-sm font-bold gradient-text-blue">₹{priceRange.toLocaleString()}</span>
            <span className="text-xs text-muted-foreground bg-accent px-2 py-1 rounded-md">₹1L</span>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50">
        <h3 className="font-bold text-foreground mb-4">Crypto Accepted</h3>
        <div className="space-y-3">
          {(["algo", "usdc"] as const).map((crypto) => (
            <label key={crypto} className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                cryptoFilters[crypto] ? "bg-primary border-primary" : "border-border group-hover:border-primary/50"
              }`}>
                {cryptoFilters[crypto] && (
                  <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <input type="checkbox" checked={cryptoFilters[crypto]}
                onChange={() => setCryptoFilters((p) => ({ ...p, [crypto]: !p[crypto] }))}
                className="sr-only" />
              <span className="text-sm text-foreground uppercase font-bold tracking-wide">{crypto}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default FiltersSidebar;
