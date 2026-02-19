import { Heart, MapPin, Star, ShoppingCart, TrendingUp } from "lucide-react";
import { useState } from "react";
import productBook from "@/assets/product-book.jpg";
import productLaptop from "@/assets/product-laptop.jpg";
import productDesk from "@/assets/product-desk.jpg";
import productHeadphones from "@/assets/product-headphones.jpg";

const products = [
  {
    id: 1,
    title: "Data Structures Book",
    priceINR: "₹1,200",
    priceALGO: "3.5 ALGO",
    location: "IIIT Delhi",
    rating: 4.8,
    image: productBook,
    tag: "Popular",
    tagColor: "from-[hsl(152,60%,42%)] to-[hsl(170,55%,38%)]",
  },
  {
    id: 2,
    title: "Laptop – Dell XPS 13",
    priceINR: "₹25,000",
    priceALGO: "72.8 ALGO",
    location: "BITS Pilani",
    rating: 4.5,
    image: productLaptop,
    tag: "Hot Deal",
    tagColor: "from-[hsl(0,84%,60%)] to-[hsl(20,90%,55%)]",
  },
  {
    id: 3,
    title: "Study Desk & Chair",
    priceINR: "₹6,000",
    priceALGO: "18.5 ALGO",
    location: "Mumbai Univ",
    rating: 4.6,
    image: productDesk,
    tag: "New",
    tagColor: "from-[hsl(214,80%,55%)] to-[hsl(230,70%,55%)]",
  },
  {
    id: 4,
    title: "Wireless Headphones",
    priceINR: "₹1,500",
    priceALGO: "4.3 ALGO",
    location: "NIT Kanpur",
    rating: 4.7,
    image: productHeadphones,
    tag: "Trending",
    tagColor: "from-[hsl(38,92%,50%)] to-[hsl(28,90%,50%)]",
  },
];

const ProductGrid = () => {
  const [favorites, setFavorites] = useState<number[]>([]);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex-1">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-foreground flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-secondary" />
            Trending on Campus
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Fresh listings from students near you</p>
        </div>
        <button className="text-sm font-semibold text-secondary hover:underline underline-offset-4 transition-all">
          View All →
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-2 group border border-border/40"
          >
            {/* Image */}
            <div className="relative h-44 overflow-hidden bg-muted">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              {/* Gradient overlay on image */}
              <div className="absolute inset-0 bg-gradient-to-t from-[hsl(0,0%,0%,0.2)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Tag */}
              <div className={`absolute top-3 left-3 bg-gradient-to-r ${product.tagColor} text-[hsl(0,0%,100%)] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm`}>
                {product.tag}
              </div>

              {/* Favorite */}
              <button
                onClick={() => toggleFavorite(product.id)}
                className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  favorites.includes(product.id)
                    ? "bg-destructive shadow-sm"
                    : "glass border border-[hsl(0,0%,100%,0.3)] hover:scale-110"
                }`}
              >
                <Heart
                  className={`w-4 h-4 transition-colors ${
                    favorites.includes(product.id)
                      ? "fill-[hsl(0,0%,100%)] text-[hsl(0,0%,100%)]"
                      : "text-[hsl(0,0%,100%)]"
                  }`}
                />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
              <h3 className="font-bold text-sm text-foreground leading-tight line-clamp-1">{product.title}</h3>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-lg font-extrabold text-foreground">{product.priceINR}</span>
                  <span className="block text-xs text-muted-foreground mt-0.5">≈ {product.priceALGO}</span>
                </div>
                <div className="flex items-center gap-1 bg-[hsl(38,92%,50%,0.12)] text-warning px-2 py-1 rounded-lg">
                  <Star className="w-3.5 h-3.5 fill-warning" />
                  <span className="text-xs font-bold">{product.rating}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="w-3.5 h-3.5 text-secondary" />
                <span>{product.location}</span>
              </div>

              <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-[hsl(170,55%,38%)] text-primary-foreground py-2.5 rounded-xl text-xs font-bold hover:shadow-glow-green hover:scale-[1.02] transition-all">
                <ShoppingCart className="w-3.5 h-3.5" />
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
