import { Book, Monitor, Armchair } from "lucide-react";
import { useState } from "react";

const categories = [
  { name: "Books", icon: Book, count: 24 },
  { name: "Electronics", icon: Monitor, count: 18 },
  { name: "Furniture", icon: Armchair, count: 12 },
];

const FiltersSidebar = () => {
  const [priceRange, setPriceRange] = useState(5000);
  const [selectedCategory, setSelectedCategory] = useState("Books");
  const [cryptoFilters, setCryptoFilters] = useState({ algo: true, usdc: false });

  return (
    <aside className="w-64 shrink-0 space-y-5">
      {/* Categories */}
      <div className="bg-card rounded-2xl p-5 shadow-card">
        <h3 className="text-sm font-semibold text-foreground mb-3">Categories</h3>
        <div className="space-y-1.5">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                selectedCategory === cat.name
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-accent"
              }`}
            >
              <cat.icon className="w-4 h-4" />
              {cat.name}
              <span className="ml-auto text-xs bg-muted px-2 py-0.5 rounded-full">{cat.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="bg-card rounded-2xl p-5 shadow-card">
        <h3 className="text-sm font-semibold text-foreground mb-3">Price Range</h3>
        <input
          type="range"
          min={0}
          max={10000}
          value={priceRange}
          onChange={(e) => setPriceRange(Number(e.target.value))}
          className="w-full accent-primary"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>₹0</span>
          <span className="font-medium text-foreground">₹{priceRange.toLocaleString()}</span>
          <span>₹10,000</span>
        </div>
      </div>

      {/* Crypto Accepted */}
      <div className="bg-card rounded-2xl p-5 shadow-card">
        <h3 className="text-sm font-semibold text-foreground mb-3">Crypto Accepted</h3>
        <div className="space-y-3">
          {(["algo", "usdc"] as const).map((crypto) => (
            <label key={crypto} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={cryptoFilters[crypto]}
                onChange={() => setCryptoFilters((p) => ({ ...p, [crypto]: !p[crypto] }))}
                className="w-4 h-4 rounded border-border accent-primary"
              />
              <span className="text-sm text-foreground uppercase font-medium">{crypto}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default FiltersSidebar;
