
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
          user_profile:profiles(id, full_name, email),
          assigned_profile:profiles(id, full_name, email)
        `)
        .eq("user_profile.id", "complaints.user_id")
        .eq("assigned_profile.id", "complaints.assigned_to")
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
