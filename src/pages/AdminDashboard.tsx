import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, BarChart3, FileText, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useAllComplaints } from "@/hooks/useAllComplaints";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function AdminDashboard() {
  const { complaints } = useAllComplaints();
  
  // Calculate complaint statistics
  const totalComplaints = complaints.length;
  const resolvedComplaints = complaints.filter(c => c.status === "Resolved").length;
  const pendingComplaints = complaints.filter(c => c.status === "Pending").length;
  const resolutionRate = totalComplaints ? Math.round((resolvedComplaints / totalComplaints) * 100) : 0;
  
  // Fetch total users count
  const { data: usersData } = useQuery({
    queryKey: ["total-users"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });
      
      if (error) throw error;
      return count ?? 0;
    }
  });
  
  const totalUsers = usersData || 0;
  
  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Complaints</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalComplaints}</div>
            <p className="text-xs text-muted-foreground">
              All submitted complaints
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resolvedComplaints}</div>
            <p className="text-xs text-muted-foreground">
              {resolutionRate}% resolution rate
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingComplaints}</div>
            <p className="text-xs text-muted-foreground">
              Requiring attention
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Registered users
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
          <Link to="/admin/complaints" className="block p-6">
            <h3 className="text-lg font-medium mb-2 flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Manage Complaints
            </h3>
            <p className="text-sm text-muted-foreground">
              View and respond to citizen complaints
            </p>
          </Link>
        </Card>
        
        <Card className="hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
          <Link to="/admin/users" className="block p-6">
            <h3 className="text-lg font-medium mb-2 flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Manage Users
            </h3>
            <p className="text-sm text-muted-foreground">
              Manage user accounts and permissions
            </p>
          </Link>
        </Card>
        
        <Card className="hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
          <Link to="/admin/settings" className="block p-6">
            <h3 className="text-lg font-medium mb-2 flex items-center">
              <BarChart className="mr-2 h-5 w-5" />
              System Settings
            </h3>
            <p className="text-sm text-muted-foreground">
              Configure system preferences
            </p>
          </Link>
        </Card>
      </div>
      
      {/* Recent Activity - Show 5 most recent complaints */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {complaints.length === 0 ? (
            <div className="text-center py-4 text-gray-500">No recent activity</div>
          ) : (
            <div className="space-y-4">
              {complaints.slice(0, 5).map((complaint) => {
                const activityColor = 
                  complaint.status === "Resolved" ? "bg-green-500" :
                  complaint.status === "In Progress" ? "bg-blue-500" :
                  "bg-yellow-500";
                
                const timeAgo = getTimeAgo(new Date(complaint.created_at));
                
                return (
                  <div key={complaint.id} className="flex items-center">
                    <div className={`w-2 h-2 rounded-full ${activityColor} mr-2`}></div>
                    <p className="text-sm">
                      New complaint about <span className="font-medium">{complaint.category}</span> submitted
                      {complaint.user_profile && complaint.user_profile.full_name ? ` by ${complaint.user_profile.full_name}` : ''}
                    </p>
                    <span className="ml-auto text-xs text-muted-foreground">{timeAgo}</span>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

// Helper function to display time in a human-readable format
function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  
  return date.toLocaleDateString();
}
