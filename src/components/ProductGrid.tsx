import { Heart, MapPin, Star } from "lucide-react";
import { useState } from "react";
import productBook from "@/assets/product-book.jpg";
import productLaptop from "@/assets/product-laptop.jpg";
import productDesk from "@/assets/product-desk.jpg";
import productHeadphones from "@/assets/product-headphones.jpg";

const products = [
  {
    id: 1,
    title: "Data Structures Book",
    priceINR: "₹ 1200",
    priceALGO: "3.5 ALGO",
    location: "IIIT Delhi Campus",
    rating: 4.8,
    image: productBook,
  },
  {
    id: 2,
    title: "Laptop - Dell XPS 13",
    priceINR: "25,000",
    priceALGO: "72.8 ALGO",
    location: "BITS Pilani",
    rating: 4.5,
    image: productLaptop,
  },
  {
    id: 3,
    title: "Study Desk & Chair",
    priceINR: "₹ 6000",
    priceALGO: "18.5 ALGO",
    location: "Mumbai Univ",
    rating: 4.6,
    image: productDesk,
  },
  {
    id: 4,
    title: "Wireless Headphones",
    priceINR: "₹ 1500",
    priceALGO: "4.3 ALGO",
    location: "NIT Kanpur",
    rating: 4.7,
    image: productHeadphones,
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
    <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 group"
        >
          {/* Image */}
          <div className="relative h-40 overflow-hidden bg-muted">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Content */}
          <div className="p-3 space-y-2">
            {/* Title + Heart */}
            <div className="flex items-start justify-between gap-1">
              <h3 className="font-semibold text-sm text-foreground leading-tight">{product.title}</h3>
              <button
                onClick={() => toggleFavorite(product.id)}
                className="shrink-0 mt-0.5"
              >
                <Heart
                  className={`w-4 h-4 transition-colors ${
                    favorites.includes(product.id)
                      ? "fill-destructive text-destructive"
                      : "text-destructive/40"
                  }`}
                />
              </button>
            </div>

            {/* Price */}
            <div className="flex items-center gap-1 text-sm">
              <Star className="w-3.5 h-3.5 fill-warning text-warning" />
              <span className="font-bold text-foreground">{product.priceINR}</span>
              <span className="text-muted-foreground">/ {product.priceALGO}</span>
            </div>

            {/* Location + Buy + Rating row */}
            <div className="flex items-center justify-between gap-1 pt-1">
              <div className="flex items-center gap-1 text-xs text-destructive">
                <MapPin className="w-3 h-3" />
                <span className="truncate max-w-[70px]">{product.location}</span>
              </div>

              <button className="bg-primary text-primary-foreground px-3 py-1 rounded-md text-xs font-semibold hover:opacity-90 transition-opacity">
                Buy Now
              </button>

              <div className="flex items-center gap-0.5 bg-secondary text-secondary-foreground px-2 py-0.5 rounded text-xs font-bold">
                <Star className="w-3 h-3" />
                {product.rating}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
