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
    priceINR: "₹350",
    priceALGO: "2.5 ALGO",
    location: "Library Block, IIT Delhi",
    rating: 4.8,
    image: productBook,
  },
  {
    id: 2,
    title: "Laptop – Dell XPS 13",
    priceINR: "₹45,000",
    priceALGO: "320 ALGO",
    location: "Hostel 5, IIT Bombay",
    rating: 4.9,
    image: productLaptop,
  },
  {
    id: 3,
    title: "Study Desk & Chair",
    priceINR: "₹3,500",
    priceALGO: "25 ALGO",
    location: "Campus Store, BITS Pilani",
    rating: 4.5,
    image: productDesk,
  },
  {
    id: 4,
    title: "Wireless Headphones",
    priceINR: "₹2,200",
    priceALGO: "15 ALGO",
    location: "Main Gate, NIT Trichy",
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
    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 group"
        >
          {/* Image */}
          <div className="relative h-48 overflow-hidden bg-muted">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <button
              onClick={() => toggleFavorite(product.id)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-card/80 backdrop-blur flex items-center justify-center hover:bg-card transition-colors"
            >
              <Heart
                className={`w-4 h-4 transition-colors ${
                  favorites.includes(product.id)
                    ? "fill-destructive text-destructive"
                    : "text-muted-foreground"
                }`}
              />
            </button>
            <div className="absolute top-3 left-3 flex items-center gap-1 bg-card/80 backdrop-blur px-2 py-1 rounded-lg">
              <Star className="w-3 h-3 fill-warning text-warning" />
              <span className="text-xs font-semibold text-foreground">{product.rating}</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-3">
            <h3 className="font-semibold text-foreground">{product.title}</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-foreground">{product.priceINR}</span>
              <span className="text-xs text-muted-foreground">≈ {product.priceALGO}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3" />
              {product.location}
            </div>
            <button className="w-full bg-primary text-primary-foreground py-2.5 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity">
              Buy Now
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
