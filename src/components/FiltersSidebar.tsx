import { Book, Monitor, Armchair } from "lucide-react";
import { useState } from "react";

const categories = [
  { name: "Books", icon: Book, color: "bg-primary" },
  { name: "Electronics", icon: Monitor, color: "bg-warning" },
  { name: "Furniture", icon: Armchair, color: "bg-destructive" },
];

const FiltersSidebar = () => {
  const [priceRange, setPriceRange] = useState(5000);
  const [cryptoFilters, setCryptoFilters] = useState({ algo: true, usdc: false });

  return (
    <aside className="w-56 shrink-0 space-y-4">
      {/* Categories */}
      <div className="bg-card rounded-2xl p-5 shadow-card">
        <h3 className="font-bold text-foreground mb-4">Categories</h3>
        <div className="space-y-3">
          {categories.map((cat) => (
            <div key={cat.name} className="flex items-center gap-3">
              <div className={`w-7 h-7 rounded-lg ${cat.color} flex items-center justify-center`}>
                <cat.icon className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-sm text-foreground">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="bg-card rounded-2xl p-5 shadow-card">
        <h3 className="font-bold text-foreground mb-4">Price Range</h3>
        <input
          type="range"
          min={0}
          max={10000}
          value={priceRange}
          onChange={(e) => setPriceRange(Number(e.target.value))}
          className="w-full accent-secondary"
        />
      </div>

      {/* Crypto Accepted */}
      <div className="bg-card rounded-2xl p-5 shadow-card">
        <h3 className="font-bold text-foreground mb-4">Crypto Accepted</h3>
        <div className="space-y-3">
          {(["algo", "usdc"] as const).map((crypto) => (
            <label key={crypto} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={cryptoFilters[crypto]}
                onChange={() => setCryptoFilters((p) => ({ ...p, [crypto]: !p[crypto] }))}
                className="w-5 h-5 rounded border-border accent-primary"
              />
              <span className="text-sm text-foreground uppercase font-semibold">{crypto}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default FiltersSidebar;
