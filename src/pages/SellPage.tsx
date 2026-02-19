import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCreateProduct } from "@/hooks/useProducts";
import { supabase } from "@/integrations/supabase/client";
import { Upload, ArrowLeft } from "lucide-react";

const categories = ["Books", "Electronics", "Furniture", "Clothing", "Sports", "Other"];

const SellPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const createProduct = useCreateProduct();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priceInr, setPriceInr] = useState("");
  const [priceAlgo, setPriceAlgo] = useState("");
  const [category, setCategory] = useState("Books");
  const [location, setLocation] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  if (!user) {
    navigate("/auth");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      let imageUrl = "";
      if (imageFile) {
        const ext = imageFile.name.split(".").pop();
        const path = `${user.id}/${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(path, imageFile);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(path);
        imageUrl = urlData.publicUrl;
      }

      await createProduct.mutateAsync({
        title,
        description,
        price_inr: Number(priceInr),
        price_algo: Number(priceAlgo),
        category,
        location,
        image_url: imageUrl || undefined,
      });
      navigate("/");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background bg-mesh">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Market
        </button>

        <div className="bg-card rounded-3xl shadow-card border border-border/50 p-8">
          <h1 className="text-2xl font-extrabold text-foreground mb-6">Sell an Item</h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Title</label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-accent/70 border border-border/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="e.g. Data Structures Book" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Description</label>
              <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-accent/70 border border-border/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" placeholder="Describe your item..." />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Price (₹)</label>
                <input type="number" required min={0} value={priceInr} onChange={(e) => setPriceInr(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-accent/70 border border-border/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="1200" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Price (ALGO)</label>
                <input type="number" required min={0} step="0.1" value={priceAlgo} onChange={(e) => setPriceAlgo(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-accent/70 border border-border/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="3.5" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-accent/70 border border-border/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Location</label>
                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-accent/70 border border-border/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Campus name" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Product Image</label>
              <label className="flex items-center justify-center gap-2 w-full py-8 rounded-xl border-2 border-dashed border-border cursor-pointer hover:border-primary/50 hover:bg-accent/50 transition-all">
                <Upload className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{imageFile ? imageFile.name : "Click to upload image"}</span>
                <input type="file" accept="image/*" className="sr-only" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
              </label>
            </div>

            <button type="submit" disabled={uploading}
              className="w-full bg-gradient-to-r from-primary to-[hsl(170,55%,38%)] text-primary-foreground py-3.5 rounded-xl text-sm font-bold hover:shadow-glow-green transition-all disabled:opacity-50">
              {uploading ? "Publishing..." : "Publish Listing"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SellPage;
