
import { useState } from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardDescription 
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, MessageSquare, FileText, Clock, Calendar, Users, MoreHorizontal } from "lucide-react";

// Mock data for projects
const projects = [
  {
    id: 1,
    name: "City Park Renovation",
    description: "Renovation of central city park with new amenities and landscaping",
    progress: 75,
    status: "active",
    dueDate: "2025-07-15",
    team: [
      { id: 1, name: "Aisha Khan", avatar: "/placeholder.svg", role: "Project Manager" },
      { id: 2, name: "Raj Patel", avatar: "/placeholder.svg", role: "Civil Engineer" },
      { id: 3, name: "Sarah Johnson", avatar: "/placeholder.svg", role: "Landscape Designer" },
    ],
    tasks: 24,
    completedTasks: 18,
    comments: 37,
    files: 15,
    priority: "high",
    category: "Infrastructure"
  },
  {
    id: 2,
    name: "Smart Traffic System",
    description: "Implementation of AI-based traffic management across major intersections",
    progress: 40,
    status: "active",
    dueDate: "2025-09-30",
    team: [
      { id: 4, name: "John Doe", avatar: "/placeholder.svg", role: "Tech Lead" },
      { id: 5, name: "Priya Singh", avatar: "/placeholder.svg", role: "Data Analyst" },
    ],
    tasks: 32,
    completedTasks: 13,
    comments: 25,
    files: 23,
    priority: "medium",
    category: "Technology"
  },
  {
    id: 3,
    name: "Public Health Campaign",
    description: "Awareness and vaccination campaign for preventive healthcare",
    progress: 90,
    status: "active",
    dueDate: "2025-06-10",
    team: [
      { id: 6, name: "Dr. Martinez", avatar: "/placeholder.svg", role: "Medical Director" },
      { id: 7, name: "Emily Wong", avatar: "/placeholder.svg", role: "Public Health Specialist" },
      { id: 8, name: "David Brown", avatar: "/placeholder.svg", role: "Community Coordinator" },
    ],
    tasks: 18,
    completedTasks: 16,
    comments: 42,
    files: 7,
    priority: "high",
    category: "Healthcare"
  },
  {
    id: 4,
    name: "Clean Water Initiative",
    description: "Improving water quality and access in underserved neighborhoods",
    progress: 60,
    status: "paused",
    dueDate: "2025-10-20",
    team: [
      { id: 9, name: "Alex Turner", avatar: "/placeholder.svg", role: "Environmental Engineer" },
      { id: 10, name: "Leila Hassan", avatar: "/placeholder.svg", role: "Project Coordinator" },
    ],
    tasks: 29,
    completedTasks: 17,
    comments: 19,
    files: 21,
    priority: "medium", 
    category: "Environment"
  },
  {
    id: 5,
    name: "Digital Literacy Program",
    description: "Training citizens in basic computer skills and internet safety",
    progress: 30,
    status: "active",
    dueDate: "2025-11-30",
    team: [
      { id: 11, name: "Robert Chen", avatar: "/placeholder.svg", role: "Education Director" },
      { id: 12, name: "Sophia Garcia", avatar: "/placeholder.svg", role: "Technology Trainer" },
    ],
    tasks: 15,
    completedTasks: 5,
    comments: 12,
    files: 9,
    priority: "low",
    category: "Education"
  },
];

export default function AdminProjects() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  // Filter projects based on search query and active filter
  const filteredProjects = projects.filter(project => {
    const matchesSearch = 
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.category.toLowerCase().includes(searchQuery.toLowerCase());
      
    if (activeFilter === "all") return matchesSearch;
    if (activeFilter === "active") return matchesSearch && project.status === "active";
    if (activeFilter === "paused") return matchesSearch && project.status === "paused";
    if (activeFilter === "completed") return matchesSearch && project.progress === 100;
    
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>New Project</span>
        </Button>
      </div>
      
      {/* Filters and Search */}
      <div className="flex items-center justify-between pb-4">
        <Tabs defaultValue="all" className="w-auto" onValueChange={setActiveFilter}>
          <TabsList>
            <TabsTrigger value="all">All Projects</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="paused">Paused</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            type="search" 
            placeholder="Search projects" 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <Badge 
                    variant="outline" 
                    className="mb-2 text-xs"
                  >
                    {project.category}
                  </Badge>
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription className="line-clamp-2">
                {project.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="space-y-4">
                {/* Progress bar */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>
                
                {/* Team members */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Team</h4>
                  <div className="flex -space-x-2 overflow-hidden">
                    {project.team.map((member) => (
                      <Avatar key={member.id} className="border-2 border-background">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    ))}
                    {project.team.length > 3 && (
                      <div className="w-8 h-8 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center text-xs font-medium">
                        +{project.team.length - 3}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Stats and due date */}
                <div className="flex justify-between items-center pt-2">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{new Date(project.dueDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>{project.comments}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="h-3.5 w-3.5" />
                      <span>{project.files}</span>
                    </div>
                  </div>
                  <Badge 
                    variant={project.status === "active" ? "default" : "secondary"} 
                    className="text-xs"
                  >
                    {project.status === "active" ? "Active" : "Paused"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
