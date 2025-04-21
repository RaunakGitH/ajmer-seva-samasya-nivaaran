
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseSession } from "@/utils/supabaseAuth";

export const useUserComplaints = () => {
  const { session } = useSupabaseSession();
  const userId = session?.user?.id;

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["user-complaints", userId],
    enabled: !!userId,
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("complaints")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  return {
    complaints: data ?? [],
    isLoading,
    error,
    refetch,
  };
};
