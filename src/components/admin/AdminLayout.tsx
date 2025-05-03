
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

type AdminLayoutProps = {
  children: React.ReactNode;
};

export function AdminLayout({ children }: AdminLayoutProps) {
  const today = new Date();
  const formattedDate = format(today, "EEEE, do MMMM");

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-100 dark:bg-gray-900">
        <AppSidebar />
        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                type="search" 
                placeholder="Search" 
                className="pl-10 pr-4 py-2 w-full rounded-lg bg-white dark:bg-gray-800"
              />
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-muted-foreground">{formattedDate}</div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="rounded-lg">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </Button>
                <Button size="sm" variant="outline" className="rounded-lg">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </Button>
              </div>
              <ThemeToggle />
            </div>
          </div>
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
