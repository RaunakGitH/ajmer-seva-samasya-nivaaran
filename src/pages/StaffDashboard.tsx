
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  CheckCircle, Users, Loader, ClipboardCheck, BarChart2, Clock, 
  FileText, AlertTriangle, CheckSquare
} from "lucide-react";
import { Container } from "@/components/ui/container";

// Background image for the header section
const HEADER_IMAGE =
  "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=900&q=80";

export default function StaffDashboard() {
  const [activeTab, setActiveTab] = useState<'assigned' | 'activity'>('assigned');

  // Stats data for the summary cards
  const stats = [
    {
      title: "Assigned Complaints",
      value: "8",
      icon: <ClipboardCheck className="text-primary" size={24} />,
      desc: "Currently assigned to you",
      color: "bg-violet-100 dark:bg-violet-900/20",
      iconColor: "text-violet-600",
    },
    {
      title: "Resolved This Month",
      value: "21",
      icon: <CheckCircle className="text-green-600" size={24} />,
      desc: "Successfully completed",
      color: "bg-green-100 dark:bg-green-900/20",
      iconColor: "text-green-600",
    },
    {
      title: "Citizen Interactions",
      value: "32",
      icon: <Users className="text-blue-600" size={24} />,
      desc: "This month",
      color: "bg-blue-100 dark:bg-blue-900/20",
      iconColor: "text-blue-600",
    },
  ];

  // Recent assigned complaints data
  const assignedComplaints = [
    {
      id: "C-12345",
      title: "Street Light Malfunction",
      location: "Oak Street & Pine Avenue",
      priority: "High",
      date: "Today, 9:30 AM",
      status: "New"
    },
    {
      id: "C-12346",
      title: "Road Pothole Repair",
      location: "Maple Drive",
      priority: "Medium",
      date: "Yesterday",
      status: "In Progress"
    },
    {
      id: "C-12347",
      title: "Fallen Tree Branch",
      location: "Central Park",
      priority: "Medium",
      date: "2 days ago",
      status: "New"
    },
    {
      id: "C-12348",
      title: "Graffiti Removal",
      location: "Main Street Underpass",
      priority: "Low",
      date: "3 days ago",
      status: "In Progress"
    },
  ];

  // Recent activity data
  const recentActivity = [
    {
      id: "A-1234",
      action: "Complaint Resolved",
      description: "You marked complaint #C-12312 as resolved",
      time: "2 hours ago"
    },
    {
      id: "A-1235",
      action: "Comment Added",
      description: "You commented on complaint #C-12345",
      time: "4 hours ago"
    },
    {
      id: "A-1236",
      action: "Status Updated",
      description: "You changed status of #C-12346 to 'In Progress'",
      time: "Yesterday"
    },
    {
      id: "A-1237",
      action: "Complaint Assigned",
      description: "New complaint #C-12345 was assigned to you",
      time: "2 days ago"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50/80 flex flex-col">
      {/* Modern gradient header with overlay */}
      <div className="relative">
        <div
          className="h-48 w-full overflow-hidden"
          style={{
            backgroundImage: `url('${HEADER_IMAGE}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-primary/70 mix-blend-multiply" />
          <div className="relative h-full z-10 flex flex-col justify-center px-6 md:px-10">
            <div className="max-w-5xl mx-auto w-full">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">
                Staff Dashboard
              </h1>
              <p className="text-white/90 max-w-lg">
                Manage and resolve citizen complaints efficiently
              </p>
            </div>
          </div>
        </div>
      </div>

      <Container className="pb-12 -mt-10">
        {/* Stats section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {stats.map((stat) => (
            <Card 
              key={stat.title} 
              className="border-none shadow-md hover:shadow-lg transition-all duration-200"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.color} p-3 rounded-full`}>
                    {stat.icon}
                  </div>
                  <span className="text-3xl font-bold">{stat.value}</span>
                </div>
                <h3 className="font-medium mb-1">{stat.title}</h3>
                <p className="text-sm text-muted-foreground">{stat.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Tab navigation */}
        <div className="mb-6">
          <div className="border-b flex space-x-4">
            <Button
              variant="ghost"
              className={`pb-4 px-2 relative rounded-none ${
                activeTab === "assigned"
                  ? "text-primary font-medium after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary"
                  : "text-muted-foreground"
              }`}
              onClick={() => setActiveTab("assigned")}
            >
              <ClipboardCheck className="mr-2 h-4 w-4" />
              Assigned Complaints
            </Button>
            <Button
              variant="ghost"
              className={`pb-4 px-2 relative rounded-none ${
                activeTab === "activity"
                  ? "text-primary font-medium after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary"
                  : "text-muted-foreground"
              }`}
              onClick={() => setActiveTab("activity")}
            >
              <Clock className="mr-2 h-4 w-4" />
              Recent Activity
            </Button>
          </div>
        </div>

        {/* Main content based on selected tab */}
        <div className="bg-white rounded-lg shadow-sm border p-1">
          {activeTab === "assigned" && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Complaint</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignedComplaints.map((complaint) => (
                    <TableRow key={complaint.id}>
                      <TableCell className="font-medium">{complaint.id}</TableCell>
                      <TableCell>{complaint.title}</TableCell>
                      <TableCell>{complaint.location}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          complaint.priority === "High" 
                            ? "bg-red-100 text-red-700" 
                            : complaint.priority === "Medium" 
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }`}>
                          {complaint.priority}
                        </span>
                      </TableCell>
                      <TableCell>{complaint.date}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          complaint.status === "New" 
                            ? "bg-blue-100 text-blue-700" 
                            : "bg-purple-100 text-purple-700"
                        }`}>
                          {complaint.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {activeTab === "activity" && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Action</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentActivity.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell className="font-medium">{activity.action}</TableCell>
                      <TableCell>{activity.description}</TableCell>
                      <TableCell>{activity.time}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* Quick actions section */}
        <div className="mt-8">
          <h2 className="text-lg font-medium mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="flex items-center justify-center py-6 h-auto" variant="outline">
              <FileText className="mr-2 h-5 w-5" />
              Create Report
            </Button>
            <Button className="flex items-center justify-center py-6 h-auto" variant="outline">
              <CheckSquare className="mr-2 h-5 w-5" />
              Update Complaint Status
            </Button>
            <Button className="flex items-center justify-center py-6 h-auto" variant="outline">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Flag Critical Issue
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
