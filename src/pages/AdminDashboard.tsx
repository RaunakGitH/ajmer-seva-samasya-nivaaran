
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useAllComplaints } from "@/hooks/useAllComplaints";
import { ChevronRight } from "lucide-react";

const productivityData = [
  { name: "Mon", research: 3, design: 1 },
  { name: "Tue", research: 2, design: 4 },
  { name: "Wed", research: 3, design: 2 },
  { name: "Thu", research: 5, design: 3 },
  { name: "Fri", research: 4, design: 2 },
  { name: "Sat", research: 3, design: 1 },
  { name: "Sun", research: 2, design: 2 },
];

// Example task data
const tasks = [
  {
    id: 1, 
    name: "Client Onboarding - Circle", 
    assignee: { name: "Samanta J.", avatar: "/placeholder.svg" }, 
    members: 3, 
    status: "in-progress", 
    runtime: "6 hours", 
    dueDate: "6 Mon"
  },
  {
    id: 2, 
    name: "Meeting with Webflow & Notion", 
    assignee: { name: "Bob P.", avatar: "/placeholder.svg" }, 
    members: 4, 
    status: "done", 
    runtime: "2 hours", 
    dueDate: "7 Tue"
  },
  {
    id: 3, 
    name: "First Handoff with Engineers", 
    assignee: { name: "Kate O.", avatar: "/placeholder.svg" }, 
    members: 10, 
    status: "in-progress", 
    runtime: "3 days", 
    dueDate: "10 Fri"
  },
  {
    id: 4, 
    name: "Client Drafting (2) with Lawrence", 
    assignee: { name: "Jack F.", avatar: "/placeholder.svg" }, 
    members: 7, 
    status: "in-progress", 
    runtime: "1 week", 
    dueDate: "19 Sun"
  },
];

// Example projects data
const projects = [
  { id: 1, name: "Feedback", category: "Design System", progress: 65, members: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"], comments: 12, files: 0 },
  { id: 2, name: "Bug Tracking", category: "Dev Tools", progress: 40, members: ["/placeholder.svg", "/placeholder.svg"], comments: 8, files: 3 },
  { id: 3, name: "User Research", category: "Analysis", progress: 20, members: ["/placeholder.svg"], comments: 5, files: 2 },
];

export default function AdminDashboard() {
  const { complaints } = useAllComplaints();
  const [selectedTaskIds, setSelectedTaskIds] = useState<number[]>([]);

  // Toggle task selection
  const toggleTaskSelection = (taskId: number) => {
    if (selectedTaskIds.includes(taskId)) {
      setSelectedTaskIds(selectedTaskIds.filter(id => id !== taskId));
    } else {
      setSelectedTaskIds([...selectedTaskIds, taskId]);
    }
  };
  
  // Count done and in progress tasks
  const doneCount = tasks.filter(task => task.status === "done").length;
  const inProgressCount = tasks.filter(task => task.status === "in-progress").length;
  
  return (
    <main className="space-y-6">
      {/* Tasks Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Last tasks</h1>
            <p className="text-muted-foreground">{tasks.length} total, proceed to resolve them</p>
          </div>
          <div className="flex gap-10">
            <div className="text-center">
              <p className="text-3xl font-bold">{doneCount}</p>
              <p className="text-sm text-muted-foreground">Done</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{inProgressCount}</p>
              <p className="text-sm text-muted-foreground">In progress</p>
            </div>
          </div>
        </div>
        
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[40px]"></TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Admin</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Run time</TableHead>
                  <TableHead>Finish date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map(task => (
                  <TableRow key={task.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                    <TableCell>
                      <Checkbox
                        checked={selectedTaskIds.includes(task.id)}
                        onCheckedChange={() => toggleTaskSelection(task.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{task.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                          <AvatarFallback>{task.assignee.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{task.assignee.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{task.members}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={task.status === "done" 
                          ? "text-green-600 border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-900/30"
                          : "text-blue-600 border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-900/30"
                        }
                      >
                        {task.status === "done" ? "Done" : "In progress"}
                      </Badge>
                    </TableCell>
                    <TableCell>{task.runtime}</TableCell>
                    <TableCell>{task.dueDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      
      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Productivity Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Productivity</CardTitle>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <span className="h-3 w-3 rounded-full bg-blue-500"></span>
                <span>Research</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="h-3 w-3 rounded-full bg-green-500"></span>
                <span>Design</span>
              </div>
              <div className="text-xs ml-auto">
                Data updates every 3 hours
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={productivityData}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} domain={[0, 6]} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="research" 
                    stroke="#3b82f6" 
                    activeDot={{ r: 8 }} 
                    strokeWidth={3}
                    dot={{ strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="design" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Projects in Progress */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Projects in progress:</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="flex flex-col gap-4">
                {projects.map((project, index) => (
                  <Card key={project.id} className="overflow-hidden shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="secondary" className="text-xs font-normal">
                              {project.category}
                            </Badge>
                          </div>
                          <h3 className="font-medium">{project.name}</h3>
                          <div className="mt-4 flex items-center gap-2">
                            <div className="flex -space-x-2">
                              {project.members.map((avatar, i) => (
                                <Avatar key={i} className="w-6 h-6 border-2 border-background">
                                  <AvatarImage src={avatar} />
                                  <AvatarFallback>U{i}</AvatarFallback>
                                </Avatar>
                              ))}
                            </div>
                            <div className="ml-2 flex items-center gap-3 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M21 11.5C21 16.75 16.75 21 11.5 21C6.25 21 2 16.75 2 11.5C2 6.25 6.25 2 11.5 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M22 22L20 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M15 11H11.5V7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                {project.comments} comments
                              </div>
                              <div className="flex items-center gap-1">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M13 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V9L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M13 2V9H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                {project.files} files
                              </div>
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="rounded-full">
                          <ChevronRight className="h-5 w-5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="absolute -right-4 top-1/2 -translate-y-1/2 flex items-center justify-center h-8 w-8 bg-background border border-border shadow rounded-full z-10">
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
