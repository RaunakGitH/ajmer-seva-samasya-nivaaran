
import { useSupabaseSession } from "@/utils/supabaseAuth";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";

export function ProfileMenu() {
  const { session, profile, loading, logout } = useSupabaseSession();

  if (loading) return <Loader className="animate-spin" />;
  if (!session) return null;

  return (
    <div className="flex items-center space-x-3">
      <span className="text-sm font-medium">{profile?.full_name || profile?.email}</span>
      <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">{profile?.role}</span>
      <Button size="sm" variant="outline" onClick={logout}>
        Logout
      </Button>
    </div>
  );
}
