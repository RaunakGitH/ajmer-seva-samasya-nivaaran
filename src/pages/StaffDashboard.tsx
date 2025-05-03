
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import {
  Search,
  Bell,
  ChevronDown,
  Users,
  FileText,
  CheckCircle,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useAllComplaints } from "@/hooks/useAllComplaints";
import { format } from "date-fns";

// Mock data for the charts
const monthlyData = [
  { month: "Jan", satisfaction: 82, count: 120 },
  { month: "Feb", satisfaction: 93, count: 150 },
  { month: "Mar", satisfaction: 76, count: 130 },
  { month: "Apr", satisfaction: 83, count: 140 },
  { month: "May", satisfaction: 75, count: 110 },
  { month: "Jun", satisfaction: 83, count: 130 },
  { month: "Jul", satisfaction: 75, count: 110 },
  { month: "Aug", satisfaction: 92, count: 150 },
  { month: "Sep", satisfaction: 86, count: 130 },
  { month: "Oct", satisfaction: 94, count: 160 },
  { month: "Nov", satisfaction: 88, count: 140 },
  { month: "Dec", satisfaction: 86, count: 130 },
];

const npsScoreData = [
  { name: "Promoters", value: 60, color: "#4ade80" },
  { name: "Passives", value: 25, color: "#fde68a" },
  { name: "Detractors", value: 15, color: "#f87171" },
];

export default function StaffDashboard() {
  const [activeTab, setActiveTab] = useState("satisfaction");
  const [searchQuery, setSearchQuery] = useState("");
  const { complaints, isLoading, error } = useAllComplaints();

  // Filter complaints based on search query
  const filteredComplaints = complaints.filter(complaint => 
    searchQuery.length === 0 || 
    complaint.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    complaint.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    complaint.user_profile?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get only the most recent complaints for display
  const recentComplaints = [...filteredComplaints]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  return (
    <AdminLayout>
      <div className="flex flex-col w-full">
        {/* Header with search and quick actions */}
        <div className="flex items-center justify-between mb-6 gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search for tasks, complaints, and citizens" 
              className="pl-8 bg-white dark:bg-gray-900"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" className="flex items-center gap-1 h-9">
              Quick actions <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
          </div>
        </div>

        {/* Navigation tabs */}
        <Tabs defaultValue="satisfaction" className="mb-6">
          <TabsList className="bg-background border border-border w-full justify-start">
            <TabsTrigger value="metrics" onClick={() => setActiveTab("metrics")}>Complaint Metrics</TabsTrigger>
            <TabsTrigger value="satisfaction" onClick={() => setActiveTab("satisfaction")}>Citizen Satisfaction</TabsTrigger>
            <TabsTrigger value="reports" onClick={() => setActiveTab("reports")}>Reports</TabsTrigger>
            <TabsTrigger value="team" onClick={() => setActiveTab("team")}>Team Activity</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Main content */}
        <div className="space-y-6">
          {/* Stats row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <Card className="border-none shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-full">
                    <CheckCircle className="text-green-600 dark:text-green-400" size={24} />
                  </div>
                  <span className="text-3xl font-bold">80%</span>
                </div>
                <h3 className="font-medium mb-1">Satisfaction Rate</h3>
                <p className="text-sm text-muted-foreground flex items-center">
                  <span className="text-green-500 mr-1">↑ 1.3%</span> vs last month
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-full">
                    <FileText className="text-blue-600 dark:text-blue-400" size={24} />
                  </div>
                  <span className="text-3xl font-bold">{complaints.length}</span>
                </div>
                <h3 className="font-medium mb-1">Total Complaints</h3>
                <p className="text-sm text-muted-foreground flex items-center">
                  <span className="text-green-500 mr-1">↑ 4%</span> vs last month
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-amber-100 dark:bg-amber-900/20 p-3 rounded-full">
                    <AlertTriangle className="text-amber-600 dark:text-amber-400" size={24} />
                  </div>
                  <span className="text-3xl font-bold">
                    {complaints.filter(c => c.status === 'Pending').length}
                  </span>
                </div>
                <h3 className="font-medium mb-1">Pending Issues</h3>
                <p className="text-sm text-muted-foreground flex items-center">
                  <span className="text-red-500 mr-1">↑ 3</span> from yesterday
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-violet-100 dark:bg-violet-900/20 p-3 rounded-full">
                    <Users className="text-violet-600 dark:text-violet-400" size={24} />
                  </div>
                  <span className="text-3xl font-bold">248</span>
                </div>
                <h3 className="font-medium mb-1">Citizen Interactions</h3>
                <p className="text-sm text-muted-foreground flex items-center">
                  <span className="text-green-500 mr-1">↑ 12%</span> this month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Satisfaction Chart */}
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium">Citizen Satisfaction</CardTitle>
                  <Button variant="outline" size="sm" className="h-8">
                    Monthly <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Overall score — August</p>
                      <div className="flex items-center gap-2">
                        <span className="text-3xl font-bold">80%</span>
                        <span className="text-sm font-medium text-green-500">↑ 1.3%</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-6">
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span>
                          <span className="text-xs text-muted-foreground">Satisfied</span>
                        </div>
                        <p className="font-medium">60%</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <span className="h-2 w-2 rounded-full bg-yellow-400 mr-1"></span>
                          <span className="text-xs text-muted-foreground">Neutral</span>
                        </div>
                        <p className="font-medium">25%</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <span className="h-2 w-2 rounded-full bg-red-500 mr-1"></span>
                          <span className="text-xs text-muted-foreground">Unsatisfied</span>
                        </div>
                        <p className="font-medium">15%</p>
                      </div>
                    </div>
                  </div>

                  <div className="h-[250px]">
                    <ChartContainer
                      config={{
                        satisfaction: {
                          label: "Satisfaction",
                          color: "#4ade80",
                        },
                      }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={monthlyData}
                          margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                        >
                          <defs>
                            <linearGradient id="colorSatisfaction" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#4ade80" stopOpacity={0.1} />
                              <stop offset="95%" stopColor="#4ade80" stopOpacity={0.01} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid vertical={false} stroke="#f0f0f0" />
                          <XAxis 
                            dataKey="month" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 12 }}
                          />
                          <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 12 }}
                            domain={[50, 100]}
                            ticks={[50, 75, 100]}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Line
                            type="monotone"
                            dataKey="satisfaction"
                            name="Satisfaction"
                            stroke="#4ade80"
                            strokeWidth={2}
                            dot={{ r: 3, strokeWidth: 0, fill: "#4ade80" }}
                            activeDot={{ r: 5 }}
                            fill="url(#colorSatisfaction)"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* NPS Score Chart */}
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium">Net Promoter Score</CardTitle>
                  <Button variant="outline" size="sm" className="h-8">
                    Month <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">NPS score</p>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold">80%</span>
                      <span className="text-sm font-medium text-green-500">↑ 1.1%</span>
                    </div>
                  </div>
                  
                  <div className="h-4 bg-gray-100 rounded-full flex overflow-hidden">
                    <div className="bg-green-500 h-full" style={{ width: "60%" }}></div>
                    <div className="bg-amber-200 h-full" style={{ width: "25%" }}></div>
                    <div className="bg-red-300 h-full" style={{ width: "15%" }}></div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 pt-2">
                    <div>
                      <div className="flex items-center mb-1">
                        <span className="h-2.5 w-2.5 rounded-sm bg-green-500 mr-2"></span>
                        <span className="text-xs text-muted-foreground">Promoters</span>
                      </div>
                      <p className="font-medium">60%</p>
                    </div>
                    
                    <div>
                      <div className="flex items-center mb-1">
                        <span className="h-2.5 w-2.5 rounded-sm bg-amber-200 mr-2"></span>
                        <span className="text-xs text-muted-foreground">Passives</span>
                      </div>
                      <p className="font-medium">25%</p>
                    </div>
                    
                    <div>
                      <div className="flex items-center mb-1">
                        <span className="h-2.5 w-2.5 rounded-sm bg-red-300 mr-2"></span>
                        <span className="text-xs text-muted-foreground">Detractors</span>
                      </div>
                      <p className="font-medium">15%</p>
                    </div>
                  </div>
                  
                  <div className="h-[150px] pt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={npsScoreData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis hide />
                        <Tooltip />
                        <Bar dataKey="value" fill="#8884d8">
                          {npsScoreData.map((entry, index) => (
                            <rect key={`rect-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent complaints table */}
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium">Recent Complaints</CardTitle>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center py-10">
                  <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
                  <p>Loading complaints...</p>
                </div>
              ) : error ? (
                <div className="text-center py-6 text-red-500">
                  <p>Failed to load complaints. Please try again.</p>
                </div>
              ) : recentComplaints.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <p>No complaints found.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-3 text-xs font-medium text-muted-foreground">ID</th>
                        <th className="text-left p-3 text-xs font-medium text-muted-foreground">COMPLAINT</th>
                        <th className="text-left p-3 text-xs font-medium text-muted-foreground">SUBMITTED BY</th>
                        <th className="text-left p-3 text-xs font-medium text-muted-foreground">PRIORITY</th>
                        <th className="text-left p-3 text-xs font-medium text-muted-foreground">DATE</th>
                        <th className="text-left p-3 text-xs font-medium text-muted-foreground">STATUS</th>
                        <th className="text-right p-3 text-xs font-medium text-muted-foreground">ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentComplaints.map((complaint) => (
                        <tr key={complaint.id} className="border-b border-border hover:bg-muted/30">
                          <td className="p-3 text-sm font-medium">{complaint.id.slice(0, 8)}</td>
                          <td className="p-3 text-sm">{complaint.category}</td>
                          <td className="p-3 text-sm text-muted-foreground">
                            {complaint.user_profile?.full_name || 'Anonymous'}
                          </td>
                          <td className="p-3">
                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                              complaint.status === "Pending" 
                                ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" 
                                : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                            }`}>
                              {complaint.status === "Pending" ? "High" : "Medium"}
                            </span>
                          </td>
                          <td className="p-3 text-sm text-muted-foreground">
                            {format(new Date(complaint.created_at), 'MMM d, yyyy')}
                          </td>
                          <td className="p-3">
                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                              complaint.status === "Pending" 
                                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" 
                                : complaint.status === "In Progress"
                                ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                                : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            }`}>
                              {complaint.status}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}

// Custom tooltip for the chart
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-border shadow-md rounded-md">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">
          Satisfaction: <span className="text-green-500 font-medium">{payload[0].value}%</span>
        </p>
      </div>
    );
  }

  return null;
};
