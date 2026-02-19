import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";

export interface Bargain {
  id: string;
  product_id: string;
  sender_id: string;
  receiver_id: string;
  offered_price: number;
  message: string | null;
  status: string;
  created_at: string;
  profiles?: { full_name: string | null };
}

export const useBargains = (productId: string) => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["bargains", productId, user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("bargains")
        .select("*")
        .eq("product_id", productId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Bargain[];
    },
    enabled: !!user && !!productId,
  });
};

export const useCreateBargain = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ productId, receiverId, offeredPrice, message }: {
      productId: string; receiverId: string; offeredPrice: number; message: string;
    }) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("bargains")
        .insert({ product_id: productId, sender_id: user.id, receiver_id: receiverId, offered_price: offeredPrice, message });
      if (error) throw error;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["bargains", vars.productId] });
    },
  });
};

export const useUpdateBargainStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("bargains")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bargains"] });
    },
  });
};
