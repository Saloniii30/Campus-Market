import { useAuth } from "@/hooks/useAuth";
import { useMyProducts, useDeleteProduct } from "@/hooks/useProducts";
import { Navigate, useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, Edit, Plus, Loader2 } from "lucide-react";

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: products, isLoading } = useMyProducts();
  const deleteProduct = useDeleteProduct();

  if (!user) {
    return <Navigate to="/auth" state={{ from: "/dashboard" }} replace />;
  }

  return (
    <div className="min-h-screen bg-background bg-mesh">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Market
        </button>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold text-foreground">My Listings</h1>
          <button onClick={() => navigate("/sell")} className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-bold hover:shadow-glow-green transition-all">
            <Plus className="w-4 h-4" /> New Listing
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-secondary" /></div>
        ) : !products?.length ? (
          <div className="bg-card rounded-2xl p-10 shadow-card text-center text-muted-foreground border border-border/40">
            You haven't listed anything yet. Start selling!
          </div>
        ) : (
          <div className="space-y-4">
            {products.map((p) => (
              <div key={p.id} className="bg-card rounded-2xl p-5 shadow-card border border-border/40 flex items-center gap-5">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted shrink-0">
                  {p.image_url ? <img src={p.image_url} alt={p.title} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-accent" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-foreground truncate">{p.title}</h3>
                  <p className="text-sm text-muted-foreground">₹{p.price_inr.toLocaleString()} · {p.category}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => navigate(`/product/${p.id}`)} className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center hover:bg-muted transition-colors">
                    <Edit className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button onClick={() => { if (confirm("Delete this listing?")) deleteProduct.mutate(p.id); }}
                    className="w-9 h-9 rounded-lg bg-destructive/10 flex items-center justify-center hover:bg-destructive/20 transition-colors">
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
