
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ui/theme-toggle";

type AdminLayoutProps = {
  children: React.ReactNode;
};

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <main className="flex-1 p-6 bg-background">
          <div className="flex items-center justify-between mb-5">
            <SidebarTrigger className="md:hidden" />
            <div className="flex-1" />
            <ThemeToggle />
          </div>
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
