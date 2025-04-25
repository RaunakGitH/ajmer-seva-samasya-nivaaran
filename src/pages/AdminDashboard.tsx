
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, BarChart3, FileText, Users } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
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
            <div className="text-2xl font-bold">120</div>
            <p className="text-xs text-muted-foreground">
              +15% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">75</div>
            <p className="text-xs text-muted-foreground">
              62.5% resolution rate
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
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
            <div className="text-2xl font-bold">240</div>
            <p className="text-xs text-muted-foreground">
              +12 this week
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
      
      {/* Recent Activity */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
              <p className="text-sm">New complaint submitted by <span className="font-medium">Rahul Sharma</span></p>
              <span className="ml-auto text-xs text-muted-foreground">2 hours ago</span>
            </div>
            
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
              <p className="text-sm">Complaint <span className="font-medium">#124</span> marked as resolved</p>
              <span className="ml-auto text-xs text-muted-foreground">5 hours ago</span>
            </div>
            
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
              <p className="text-sm">New user registration: <span className="font-medium">Priya Patel</span></p>
              <span className="ml-auto text-xs text-muted-foreground">Yesterday</span>
            </div>
            
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
              <p className="text-sm">System maintenance completed</p>
              <span className="ml-auto text-xs text-muted-foreground">2 days ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
