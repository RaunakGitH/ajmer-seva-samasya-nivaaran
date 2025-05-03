
import { useState } from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle2,
  Bell,
  UserPlus,
  AlertTriangle,
  FileWarning,
  ClipboardCheck,
  MessageSquare,
  Clock,
  MoreHorizontal,
  Settings
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";

// Example notification data
const notifications = [
  {
    id: "1",
    title: "New complaint registered",
    description: "Jayesh Sharma submitted a complaint about road damage in Sector 7.",
    time: "10 minutes ago",
    read: false,
    category: "complaint",
    priority: "medium"
  },
  {
    id: "2",
    title: "System maintenance scheduled",
    description: "The system will undergo maintenance on May 10th from 2:00 AM to 4:00 AM.",
    time: "2 hours ago",
    read: true,
    category: "system",
    priority: "high"
  },
  {
    id: "3",
    title: "New staff account created",
    description: "A new staff account was created for Priya Mehta.",
    time: "Yesterday",
    read: false,
    category: "user",
    priority: "low"
  },
  {
    id: "4",
    title: "Complaint resolved",
    description: "The garbage collection complaint in Green Park has been resolved.",
    time: "Yesterday",
    read: true,
    category: "complaint",
    priority: "medium"
  },
  {
    id: "5",
    title: "Critical system alert",
    description: "Database storage is reaching 90% capacity. Please review and cleanup.",
    time: "2 days ago",
    read: false,
    category: "system",
    priority: "critical"
  }
];

// Notification settings
const notificationSettings = [
  { id: "new_complaints", name: "New Complaints", enabled: true, channel: "all" },
  { id: "status_changes", name: "Status Changes", enabled: true, channel: "email" },
  { id: "system_alerts", name: "System Alerts", enabled: true, channel: "all" },
  { id: "user_registrations", name: "New User Registrations", enabled: false, channel: "none" },
  { id: "task_assignments", name: "Task Assignments", enabled: true, channel: "app" },
];

export default function AdminNotifications() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [notificationConfig, setNotificationConfig] = useState(notificationSettings);
  const { toast } = useToast();

  // Filter notifications based on the active filter
  const filteredNotifications = activeFilter === "all" 
    ? notifications
    : activeFilter === "unread"
    ? notifications.filter(n => !n.read)
    : notifications.filter(n => n.category === activeFilter);

  const getNotificationIcon = (category: string, priority: string) => {
    switch(category) {
      case "complaint":
        return priority === "high" || priority === "critical" ? 
          <AlertTriangle className="h-5 w-5" /> : 
          <ClipboardCheck className="h-5 w-5" />;
      case "system":
        return <FileWarning className="h-5 w-5" />;
      case "user":
        return <UserPlus className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };
  
  const getNotificationColor = (priority: string) => {
    switch(priority) {
      case "critical":
        return "text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400";
      case "high":
        return "text-amber-600 bg-amber-100 dark:bg-amber-900/20 dark:text-amber-400";
      case "medium":
        return "text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400";
      case "low":
        return "text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-400";
    }
  };
  
  const handleToggleRead = (id: string) => {
    // In a real app, this would update the notification status in the backend
    toast({
      title: "Notification marked as read",
      description: "The notification has been marked as read."
    });
  };
  
  const handleToggleSetting = (settingId: string) => {
    setNotificationConfig(
      notificationConfig.map(setting => 
        setting.id === settingId 
          ? { ...setting, enabled: !setting.enabled } 
          : setting
      )
    );
    
    toast({
      title: "Notification setting updated",
      description: "Your notification preferences have been saved."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">
            Manage your notifications and alerts
          </p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </Button>
      </div>
      
      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveFilter}>
        <div className="flex justify-between items-center pb-4">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">
              Unread
              <Badge variant="secondary" className="ml-1.5">
                {notifications.filter(n => !n.read).length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="complaint">Complaints</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="user">Users</TabsTrigger>
          </TabsList>
          
          <Button variant="ghost" size="sm" className="text-sm" onClick={() => {
            toast({
              title: "All notifications marked as read",
              description: "All notifications have been marked as read."
            });
          }}>
            <CheckCircle2 className="h-4 w-4 mr-1.5" />
            Mark all as read
          </Button>
        </div>
        
        {filteredNotifications.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-12 flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Bell className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">No notifications</h3>
              <p className="text-sm text-muted-foreground text-center max-w-md">
                You don't have any {activeFilter !== 'all' ? activeFilter : ''} notifications at the moment. 
                New notifications will appear here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`overflow-hidden transition-colors ${!notification.read ? 'bg-primary/5' : ''}`}
              >
                <CardContent className="p-0">
                  <div className="flex p-4 gap-4">
                    <div className={`min-w-10 h-10 rounded-full flex items-center justify-center ${getNotificationColor(notification.priority)}`}>
                      {getNotificationIcon(notification.category, notification.priority)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={`font-medium ${!notification.read ? 'text-primary' : ''}`}>
                          {notification.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {notification.time}
                          </span>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {notification.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs font-normal">
                          {notification.category}
                        </Badge>
                        {!notification.read && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-xs h-7" 
                            onClick={() => handleToggleRead(notification.id)}
                          >
                            <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                            Mark as read
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </Tabs>
      
      {/* Notification settings section */}
      <div className="mt-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">Notification Settings</CardTitle>
            <CardDescription>
              Configure which notifications you want to receive
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notificationConfig.map((setting) => (
                <div key={setting.id} className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{setting.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {setting.enabled 
                        ? `Receiving via ${setting.channel === 'all' 
                            ? 'email and app notifications' 
                            : setting.channel}` 
                        : 'Disabled'}
                    </p>
                  </div>
                  <Switch
                    checked={setting.enabled}
                    onCheckedChange={() => handleToggleSetting(setting.id)}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
