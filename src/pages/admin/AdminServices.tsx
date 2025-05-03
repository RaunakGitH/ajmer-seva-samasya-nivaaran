
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardFooter,
  CardDescription 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Settings, 
  Plus, 
  FileEdit, 
  Trash2, 
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
  RefreshCcw
} from "lucide-react";

// Example service data
const services = [
  {
    id: "1",
    name: "Complaint Registration",
    description: "Allow citizens to register complaints about civic issues",
    status: "active",
    usage: "high",
    department: "Public Services",
    users: 3450,
    lastUpdated: "2025-04-15",
    metrics: {
      uptime: 99.8,
      responseTime: 1.2,
      dailyRequests: 240
    }
  },
  {
    id: "2",
    name: "Document Verification",
    description: "Verify identity documents and certificates",
    status: "active",
    usage: "medium",
    department: "Records",
    users: 2100,
    lastUpdated: "2025-03-28",
    metrics: {
      uptime: 99.5,
      responseTime: 2.1,
      dailyRequests: 120
    }
  },
  {
    id: "3",
    name: "Water Bill Payment",
    description: "Online payment portal for water utility bills",
    status: "maintenance",
    usage: "high",
    department: "Water Department",
    users: 4200,
    lastUpdated: "2025-04-10",
    metrics: {
      uptime: 97.2,
      responseTime: 3.4,
      dailyRequests: 185
    }
  },
  {
    id: "4",
    name: "Building Permit Application",
    description: "Apply for construction and renovation permits",
    status: "active",
    usage: "medium",
    department: "Urban Planning",
    users: 780,
    lastUpdated: "2025-04-01",
    metrics: {
      uptime: 99.9,
      responseTime: 1.8,
      dailyRequests: 45
    }
  },
  {
    id: "5",
    name: "Public Transportation Tracker",
    description: "Real-time location tracking for buses and public transport",
    status: "inactive",
    usage: "low",
    department: "Transportation",
    users: 1500,
    lastUpdated: "2025-02-15",
    metrics: {
      uptime: 0,
      responseTime: 0,
      dailyRequests: 0
    }
  }
];

export default function AdminServices() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Services Management</h1>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>New Service</span>
        </Button>
      </div>
      
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="metrics">Service Metrics</TabsTrigger>
        </TabsList>
        
        {/* List View Content */}
        <TabsContent value="list" className="space-y-4">
          {services.map((service) => (
            <Card key={service.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex items-center gap-4 p-6">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center 
                    ${service.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                    service.status === 'maintenance' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 
                    'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-400'}`}>
                    {service.status === 'active' ? <CheckCircle className="h-6 w-6" /> : 
                     service.status === 'maintenance' ? <RefreshCcw className="h-6 w-6" /> : 
                     <AlertCircle className="h-6 w-6" />}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium">{service.name}</h3>
                      <Badge 
                        variant={
                          service.status === 'active' ? 'default' : 
                          service.status === 'maintenance' ? 'outline' : 'secondary'
                        }
                      >
                        {service.status === 'active' ? 'Active' : 
                         service.status === 'maintenance' ? 'Maintenance' : 'Inactive'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        <span>{service.users.toLocaleString()} users</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>Updated {new Date(service.lastUpdated).toLocaleDateString()}</span>
                      </div>
                      <div>
                        Department: {service.department}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Switch 
                      checked={service.status === 'active'} 
                      aria-label="Toggle service status"
                    />
                    <Button variant="outline" size="icon">
                      <FileEdit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        {/* Service Metrics Content */}
        <TabsContent value="metrics">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.filter(service => service.status !== 'inactive').map((service) => (
              <Card key={service.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base font-medium">{service.name}</CardTitle>
                    <Badge 
                      variant={service.status === 'active' ? 'default' : 'outline'} 
                      className="text-xs"
                    >
                      {service.status === 'active' ? 'Active' : 'Maintenance'}
                    </Badge>
                  </div>
                  <CardDescription>{service.department}</CardDescription>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-4">
                    <div className="flex items-center justify-between">
                      <dt className="text-sm text-muted-foreground">Uptime</dt>
                      <dd className="text-sm font-medium">
                        {service.metrics.uptime}%
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-sm text-muted-foreground">Avg. Response Time</dt>
                      <dd className="text-sm font-medium">
                        {service.metrics.responseTime}s
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-sm text-muted-foreground">Daily Requests</dt>
                      <dd className="text-sm font-medium">
                        {service.metrics.dailyRequests}
                      </dd>
                    </div>
                  </dl>
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-between">
                  <span className="text-xs text-muted-foreground">
                    Updated: {new Date(service.lastUpdated).toLocaleDateString()}
                  </span>
                  <Button variant="outline" size="sm" className="text-xs h-8">
                    <Settings className="h-3.5 w-3.5 mr-1.5" />
                    Configure
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
