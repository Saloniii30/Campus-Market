import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { ShoppingCart, Trash2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import CartCheckout from "@/components/CartCheckout";

const CartPage = () => {
  const { items, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  const [showCheckout, setShowCheckout] = useState(false);

  const totalInr = items.reduce((sum, item) => sum + item.priceInr * item.quantity, 0);
  const totalAlgo = items.reduce((sum, item) => sum + item.priceAlgo * item.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-10">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to shop
        </button>

        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3 mb-8">
          <ShoppingCart className="w-7 h-7" /> Your Cart
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground/40 mb-4" />
            <p className="text-lg text-muted-foreground">Your cart is empty</p>
            <Button onClick={() => navigate("/")} className="mt-6">Browse Products</Button>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.productId} className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card shadow-sm">
                  <img
                    src={item.imageUrl || "/placeholder.svg"}
                    alt={item.title}
                    className="w-20 h-20 rounded-lg object-cover bg-muted"
                  />
                  <div className="flex-1 min-w-0">
                    <h3
                      className="font-semibold text-foreground truncate cursor-pointer hover:text-primary transition-colors"
                      onClick={() => navigate(`/product/${item.productId}`)}
                    >
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-foreground">₹{item.priceInr.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{item.priceAlgo} ALGO</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 rounded-xl border border-border bg-card shadow-sm">
              <div className="flex justify-between text-lg font-bold text-foreground">
                <span>Total</span>
                <div className="text-right">
                  <p>₹{totalInr.toLocaleString()}</p>
                  <p className="text-sm font-normal text-muted-foreground">{totalAlgo.toFixed(2)} ALGO</p>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button variant="outline" onClick={clearCart} className="flex-1">Clear Cart</Button>
                <Button className="flex-1" onClick={() => setShowCheckout(true)}>Checkout</Button>
              </div>

              {showCheckout && (
                <CartCheckout totalAlgo={totalAlgo} onClose={() => setShowCheckout(false)} />
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default CartPage;
