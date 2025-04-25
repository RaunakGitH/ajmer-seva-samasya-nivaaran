
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAllComplaints = () => {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["all-complaints"],
    queryFn: async () => {
      // We need to properly specify the foreign keys for the nested query
      // rather than using .eq() afterward, which doesn't work for this case
      const { data, error } = await supabase
        .from("complaints")
        .select(`
          *,
          user_profile:profiles!user_id(id, full_name, email),
          assigned_profile:profiles!assigned_to(id, full_name, email)
        `)
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
