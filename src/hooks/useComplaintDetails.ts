
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useComplaintDetails = (complaintId: string) => {
  return useQuery({
    queryKey: ["complaint-details", complaintId],
    enabled: !!complaintId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("complaints")
        .select(`
          *,
          user_profile:profiles!user_id(full_name, email),
          assigned_profile:profiles!assigned_to(full_name)
        `)
        .eq("id", complaintId)
        .maybeSingle();
      
      if (error) throw error;
      if (!data) throw new Error("Complaint not found");
      
      return data;
    },
  });
};
