import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useReviews, useCreateReview } from "@/hooks/useReviews";
import { useBargains, useCreateBargain, useUpdateBargainStatus } from "@/hooks/useBargains";
import { useFavorites, useToggleFavorite } from "@/hooks/useFavorites";
import { ArrowLeft, Heart, MapPin, Star, MessageSquare, Send, Check, X, ShoppingCart } from "lucide-react";
import PayWithAlgo from "@/components/PayWithAlgo";
import { useCart } from "@/hooks/useCart";
import { useState } from "react";
import type { Product } from "@/hooks/useProducts";

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: favorites = [] } = useFavorites();
  const toggleFav = useToggleFavorite();
  const { data: reviews = [] } = useReviews(id || "");
  const createReview = useCreateReview();
  const { data: bargains = [] } = useBargains(id || "");
  const createBargain = useCreateBargain();
  const updateBargainStatus = useUpdateBargainStatus();
  const { addToCart } = useCart();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [offerMessage, setOfferMessage] = useState("");

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, profiles(full_name)")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data as Product;
    },
    enabled: !!id,
  });

  if (isLoading) return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Loading...</div>;
  if (!product) return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Product not found</div>;

  const isFav = favorites.includes(product.id);
  const isOwner = user?.id === product.user_id;
  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "N/A";

  const handleReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return navigate("/auth");
    try {
      await createReview.mutateAsync({ productId: product.id, rating, comment });
      setComment("");
      setRating(5);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return navigate("/auth");
    try {
      await createBargain.mutateAsync({
        productId: product.id,
        receiverId: product.user_id,
        offeredPrice: Number(offerPrice),
        message: offerMessage,
      });
      setOfferPrice("");
      setOfferMessage("");
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-background bg-mesh">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Market
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image */}
          <div className="bg-card rounded-3xl overflow-hidden shadow-card border border-border/50">
            {product.image_url ? (
              <img src={product.image_url} alt={product.title} className="w-full h-80 object-cover" />
            ) : (
              <div className="w-full h-80 bg-muted flex items-center justify-center text-muted-foreground">No Image</div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-secondary">{product.category}</span>
                <h1 className="text-3xl font-extrabold text-foreground mt-1">{product.title}</h1>
              </div>
              {user && !isOwner && (
                <button onClick={() => toggleFav.mutate({ productId: product.id, isFavorited: isFav })}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isFav ? "bg-destructive" : "bg-accent border border-border"}`}>
                  <Heart className={`w-5 h-5 ${isFav ? "fill-[hsl(0,0%,100%)] text-[hsl(0,0%,100%)]" : "text-muted-foreground"}`} />
                </button>
              )}
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-foreground">₹{product.price_inr.toLocaleString()}</span>
              <span className="text-lg text-muted-foreground">≈ {product.price_algo} ALGO</span>
            </div>

            {product.location && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-secondary" /> {product.location}
              </div>
            )}

            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-warning text-warning" />
              <span className="font-bold text-foreground">{avgRating}</span>
              <span className="text-sm text-muted-foreground">({reviews.length} reviews)</span>
            </div>

            {product.description && (
              <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
            )}

            {!isOwner && (
              <button
                onClick={() => addToCart({
                  productId: product.id,
                  title: product.title,
                  priceInr: product.price_inr,
                  priceAlgo: product.price_algo,
                  imageUrl: product.image_url,
                })}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-[hsl(170,55%,38%)] text-primary-foreground py-3 rounded-xl text-sm font-bold hover:shadow-glow-green hover:scale-[1.02] transition-all"
              >
                <ShoppingCart className="w-4 h-4" /> Add to Cart
              </button>
            )}

            <div className="text-xs text-muted-foreground">
              Listed by <span className="font-semibold text-foreground">{product.profiles?.full_name || "Anonymous"}</span>
            </div>
          </div>
        </div>

        {/* ALGO Payment Section */}
        {!isOwner && product.price_algo > 0 && (
          <div className="mt-8">
            <PayWithAlgo
              productId={product.id}
              priceAlgo={product.price_algo}
              sellerUserId={product.user_id}
              productTitle={product.title}
            />
          </div>
        )}

        {/* Bargain / Make Offer Section */}
        {user && !isOwner && (
          <div className="mt-10 bg-card rounded-3xl p-6 shadow-card border border-border/50">
            <h2 className="text-lg font-extrabold text-foreground flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5 text-secondary" /> Make an Offer
            </h2>
            <form onSubmit={handleOffer} className="flex gap-3 items-end">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Your Price (₹)</label>
                <input type="number" required min={1} value={offerPrice} onChange={(e) => setOfferPrice(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-accent/70 border border-border/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Enter amount" />
              </div>
              <div className="flex-[2]">
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Message</label>
                <input type="text" value={offerMessage} onChange={(e) => setOfferMessage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-accent/70 border border-border/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Optional message..." />
              </div>
              <button type="submit" className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-bold hover:shadow-glow-green transition-all flex items-center gap-1.5">
                <Send className="w-4 h-4" /> Send Offer
              </button>
            </form>

            {/* Existing bargains on this product */}
            {bargains.length > 0 && (
              <div className="mt-4 space-y-2">
                {bargains.map((b) => (
                  <div key={b.id} className="flex items-center justify-between bg-accent/50 rounded-xl px-4 py-3">
                    <div>
                      <span className="text-sm font-bold text-foreground">₹{b.offered_price.toLocaleString()}</span>
                      {b.message && <span className="text-xs text-muted-foreground ml-2">— "{b.message}"</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        b.status === "accepted" ? "bg-primary/10 text-primary" :
                        b.status === "rejected" ? "bg-destructive/10 text-destructive" :
                        "bg-warning/10 text-warning"
                      }`}>{b.status}</span>
                      {isOwner && b.status === "pending" && (
                        <>
                          <button onClick={() => updateBargainStatus.mutate({ id: b.id, status: "accepted" })} className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20"><Check className="w-4 h-4 text-primary" /></button>
                          <button onClick={() => updateBargainStatus.mutate({ id: b.id, status: "rejected" })} className="w-7 h-7 rounded-full bg-destructive/10 flex items-center justify-center hover:bg-destructive/20"><X className="w-4 h-4 text-destructive" /></button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Offers for owner */}
        {isOwner && bargains.length > 0 && (
          <div className="mt-10 bg-card rounded-3xl p-6 shadow-card border border-border/50">
            <h2 className="text-lg font-extrabold text-foreground flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5 text-secondary" /> Offers Received
            </h2>
            <div className="space-y-2">
              {bargains.map((b) => (
                <div key={b.id} className="flex items-center justify-between bg-accent/50 rounded-xl px-4 py-3">
                  <div>
                    <span className="text-sm font-bold text-foreground">₹{b.offered_price.toLocaleString()}</span>
                    {b.message && <span className="text-xs text-muted-foreground ml-2">— "{b.message}"</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      b.status === "accepted" ? "bg-primary/10 text-primary" :
                      b.status === "rejected" ? "bg-destructive/10 text-destructive" :
                      "bg-warning/10 text-warning"
                    }`}>{b.status}</span>
                    {b.status === "pending" && (
                      <>
                        <button onClick={() => updateBargainStatus.mutate({ id: b.id, status: "accepted" })} className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20"><Check className="w-4 h-4 text-primary" /></button>
                        <button onClick={() => updateBargainStatus.mutate({ id: b.id, status: "rejected" })} className="w-7 h-7 rounded-full bg-destructive/10 flex items-center justify-center hover:bg-destructive/20"><X className="w-4 h-4 text-destructive" /></button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <div className="mt-10 bg-card rounded-3xl p-6 shadow-card border border-border/50">
          <h2 className="text-lg font-extrabold text-foreground flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-warning" /> Reviews ({reviews.length})
          </h2>

          {/* Add review form */}
          {user && !isOwner && (
            <form onSubmit={handleReview} className="mb-6 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">Rating:</span>
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} type="button" onClick={() => setRating(s)}>
                    <Star className={`w-5 h-5 transition-colors ${s <= rating ? "fill-warning text-warning" : "text-border"}`} />
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <input type="text" required value={comment} onChange={(e) => setComment(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-accent/70 border border-border/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Write a review..." />
                <button type="submit" className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-bold hover:shadow-glow-green transition-all">
                  Post
                </button>
              </div>
            </form>
          )}

          {/* Reviews list */}
          {reviews.length === 0 ? (
            <p className="text-sm text-muted-foreground">No reviews yet. Be the first!</p>
          ) : (
            <div className="space-y-3">
              {reviews.map((r) => (
                <div key={r.id} className="bg-accent/40 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-foreground">{r.profiles?.full_name || "Anonymous"}</span>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`w-3 h-3 ${s <= r.rating ? "fill-warning text-warning" : "text-border"}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
