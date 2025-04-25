
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
      const { data, error } = await supabase
        .from("complaints")
        .select(`
          *,
          profiles:user_id(full_name, email)
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
