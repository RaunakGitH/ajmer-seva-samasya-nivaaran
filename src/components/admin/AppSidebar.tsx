
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  FolderKanban,
  Settings,
  BellRing,
  MessageSquare,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AppSidebar() {
  const location = useLocation();
  
  // Check if the current path matches the given path
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <Sidebar className="border-r border-border bg-background">
      <SidebarContent>
        {/* Logo */}
        <div className="flex items-center gap-2 px-6 py-4">
          <div className="bg-primary p-1.5 rounded">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 7L5 7" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <path d="M19 12L5 12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <path d="M19 17L5 17" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="font-bold text-xl">SAMASYA</span>
        </div>
        
        {/* Main Navigation */}
        <SidebarGroup className="px-2">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/admin/dashboard")}>
                  <Link to="/admin/dashboard" className="flex items-center gap-3 px-3 py-2">
                    <LayoutDashboard className="w-5 h-5" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/admin/projects")}>
                  <Link to="/admin/projects" className="flex items-center gap-3 px-3 py-2">
                    <FolderKanban className="w-5 h-5" />
                    <span>Projects</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/admin/complaints")}>
                  <Link to="/admin/complaints" className="flex items-center gap-3 px-3 py-2">
                    <ClipboardList className="w-5 h-5" />
                    <span>Task list</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/admin/services")}>
                  <Link to="/admin/services" className="flex items-center gap-3 px-3 py-2">
                    <Settings className="w-5 h-5" />
                    <span>Services</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/admin/notifications")}>
                  <Link to="/admin/notifications" className="flex items-center gap-3 px-3 py-2">
                    <div className="relative">
                      <BellRing className="w-5 h-5" />
                      <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">2</span>
                    </div>
                    <span>Notifications</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/admin/chat")}>
                  <Link to="/admin/chat" className="flex items-center gap-3 px-3 py-2">
                    <MessageSquare className="w-5 h-5" />
                    <span>Chat</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/admin/users")}>
                  <Link to="/admin/users" className="flex items-center gap-3 px-3 py-2">
                    <User className="w-5 h-5" />
                    <span>Users</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {/* User Profile */}
        <div className="mt-auto px-4 py-4 border-t border-border">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="/placeholder.svg" alt="Admin" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm">Admin User</p>
              <p className="text-xs text-muted-foreground">admin@samasya.gov</p>
            </div>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
