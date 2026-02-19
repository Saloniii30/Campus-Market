import { Heart, MapPin, Star, ShoppingCart, TrendingUp, Loader2 } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useFavorites, useToggleFavorite } from "@/hooks/useFavorites";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useNavigate } from "react-router-dom";

import productBook from "@/assets/product-book.jpg";
import productLaptop from "@/assets/product-laptop.jpg";
import productDesk from "@/assets/product-desk.jpg";
import productHeadphones from "@/assets/product-headphones.jpg";

const fallbackImages = [productBook, productLaptop, productDesk, productHeadphones];

interface ProductGridProps {
  search?: string;
  category?: string;
  maxPrice?: number;
}

const ProductGrid = ({ search, category, maxPrice }: ProductGridProps) => {
  const { data: products, isLoading } = useProducts({ search, category, maxPrice });
  const { data: favorites = [] } = useFavorites();
  const toggleFav = useToggleFavorite();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleFav = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    if (!user) return navigate("/auth");
    toggleFav.mutate({ productId, isFavorited: favorites.includes(productId) });
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-secondary" />
      </div>
    );
  }

  if (!products?.length) {
    return (
      <div className="flex-1">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-foreground flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-secondary" /> Trending on Campus
            </h2>
            <p className="text-sm text-muted-foreground mt-1">Fresh listings from students near you</p>
          </div>
        </div>
        <div className="bg-card rounded-2xl p-10 shadow-card text-center text-muted-foreground border border-border/40">
          No products found. Be the first to list something!
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-foreground flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-secondary" /> Trending on Campus
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Fresh listings from students near you</p>
        </div>
        <span className="text-sm text-muted-foreground">{products.length} items</span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((product, i) => {
          const isFav = favorites.includes(product.id);
          return (
            <div
              key={product.id}
              onClick={() => navigate(`/product/${product.id}`)}
              className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-2 group border border-border/40 cursor-pointer"
            >
              <div className="relative h-44 overflow-hidden bg-muted">
                <img
                  src={product.image_url || fallbackImages[i % fallbackImages.length]}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[hsl(0,0%,0%,0.2)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-3 left-3 bg-gradient-to-r from-[hsl(214,80%,55%)] to-[hsl(230,70%,55%)] text-[hsl(0,0%,100%)] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                  {product.category}
                </div>
                <button
                  onClick={(e) => handleFav(e, product.id)}
                  className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    isFav ? "bg-destructive shadow-sm" : "glass border border-[hsl(0,0%,100%,0.3)] hover:scale-110"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFav ? "fill-[hsl(0,0%,100%)] text-[hsl(0,0%,100%)]" : "text-[hsl(0,0%,100%)]"}`} />
                </button>
              </div>

              <div className="p-4 space-y-3">
                <h3 className="font-bold text-sm text-foreground leading-tight line-clamp-1">{product.title}</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-extrabold text-foreground">₹{product.price_inr.toLocaleString()}</span>
                    <span className="block text-xs text-muted-foreground mt-0.5">≈ {product.price_algo} ALGO</span>
                  </div>
                </div>
                {product.location && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5 text-secondary" />
                    <span>{product.location}</span>
                  </div>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart({
                      productId: product.id,
                      title: product.title,
                      priceInr: product.price_inr,
                      priceAlgo: product.price_algo,
                      imageUrl: product.image_url,
                    });
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-[hsl(170,55%,38%)] text-primary-foreground py-2.5 rounded-xl text-xs font-bold hover:shadow-glow-green hover:scale-[1.02] transition-all"
                >
                  <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductGrid;
