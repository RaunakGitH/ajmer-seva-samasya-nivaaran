
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { OfflineIndicator } from "@/components/common/OfflineIndicator";
import { MaintenanceMode } from "@/components/common/MaintenanceMode";
import { API_CONFIG, ENV } from "@/utils/environment";
import { logger } from "@/utils/logger";
import { useEffect, useState } from "react";

// Import pages
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import SubmitComplaint from "./pages/SubmitComplaint";
import CitizenDashboard from "./pages/CitizenDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import AdminLogin from "./pages/AdminLogin";
import Complaints from "./pages/Complaints";
import ComplaintDetails from "./pages/ComplaintDetails";
import ComplaintSuccess from "./pages/ComplaintSuccess";
import EscalationForm from "./pages/EscalationForm";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

// Import admin pages with layout
import { AdminLayout } from "./components/admin/AdminLayout";
import AdminDashboardMain from "./pages/admin/AdminDashboard";
import AdminComplaints from "./pages/admin/AdminComplaints";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminServices from "./pages/admin/AdminServices";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminNotifications from "./pages/admin/AdminNotifications";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminChat from "./pages/admin/AdminChat";

// Production-ready Query Client configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: ENV.isProduction ? 5 * 60 * 1000 : 60 * 1000, // 5 min in prod, 1 min in dev
      gcTime: ENV.isProduction ? 10 * 60 * 1000 : 5 * 60 * 1000, // 10 min in prod, 5 min in dev
      retry: (failureCount, error: any) => {
        // Don't retry on auth errors
        if (error?.status === 401 || error?.status === 403) {
          return false;
        }
        return failureCount < API_CONFIG.retryAttempts;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: ENV.isProduction ? 2 : 1,
    },
  },
});

// Check for maintenance mode (could be controlled by environment variable)
const isMaintenanceMode = false; // This would typically come from an environment variable

function App() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize application
    logger.info('Application starting', {
      environment: ENV.isProduction ? 'production' : 'development',
      version: '1.0.0',
    });

    // Simulate initialization delay for production readiness
    const initTimeout = setTimeout(() => {
      setIsInitialized(true);
      logger.info('Application initialized successfully');
    }, ENV.isProduction ? 1000 : 100);

    return () => clearTimeout(initTimeout);
  }, []);

  // Show maintenance mode if enabled
  if (isMaintenanceMode) {
    return <MaintenanceMode />;
  }

  // Show loading state during initialization
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <OfflineIndicator />
          <Toaster />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              
              {/* Protected citizen routes */}
              <Route path="/submit-complaint" element={
                <AuthGuard requireAuth={true}>
                  <SubmitComplaint />
                </AuthGuard>
              } />
              <Route path="/citizen-dashboard" element={
                <AuthGuard requireAuth={true} allowedRoles={['citizen']}>
                  <CitizenDashboard />
                </AuthGuard>
              } />
              <Route path="/complaints" element={
                <AuthGuard requireAuth={true}>
                  <Complaints />
                </AuthGuard>
              } />
              <Route path="/complaint/:id" element={
                <AuthGuard requireAuth={true}>
                  <ComplaintDetails />
                </AuthGuard>
              } />
              <Route path="/complaint-success" element={
                <AuthGuard requireAuth={true}>
                  <ComplaintSuccess />
                </AuthGuard>
              } />
              <Route path="/escalate/:complaintId" element={
                <AuthGuard requireAuth={true}>
                  <EscalationForm />
                </AuthGuard>
              } />
              
              {/* Protected staff routes */}
              <Route path="/staff-dashboard" element={
                <AuthGuard requireAuth={true} allowedRoles={['staff']}>
                  <StaffDashboard />
                </AuthGuard>
              } />
              
              {/* Protected admin routes with layout */}
              <Route path="/admin/dashboard" element={
                <AuthGuard requireAuth={true} allowedRoles={['admin']}>
                  <AdminLayout>
                    <AdminDashboardMain />
                  </AdminLayout>
                </AuthGuard>
              } />
              <Route path="/admin/complaints" element={
                <AuthGuard requireAuth={true} allowedRoles={['admin']}>
                  <AdminLayout>
                    <AdminComplaints />
                  </AdminLayout>
                </AuthGuard>
              } />
              <Route path="/admin/users" element={
                <AuthGuard requireAuth={true} allowedRoles={['admin']}>
                  <AdminLayout>
                    <AdminUsers />
                  </AdminLayout>
                </AuthGuard>
              } />
              <Route path="/admin/services" element={
                <AuthGuard requireAuth={true} allowedRoles={['admin']}>
                  <AdminLayout>
                    <AdminServices />
                  </AdminLayout>
                </AuthGuard>
              } />
              <Route path="/admin/projects" element={
                <AuthGuard requireAuth={true} allowedRoles={['admin']}>
                  <AdminLayout>
                    <AdminProjects />
                  </AdminLayout>
                </AuthGuard>
              } />
              <Route path="/admin/notifications" element={
                <AuthGuard requireAuth={true} allowedRoles={['admin']}>
                  <AdminLayout>
                    <AdminNotifications />
                  </AdminLayout>
                </AuthGuard>
              } />
              <Route path="/admin/settings" element={
                <AuthGuard requireAuth={true} allowedRoles={['admin']}>
                  <AdminLayout>
                    <AdminSettings />
                  </AdminLayout>
                </AuthGuard>
              } />
              <Route path="/admin/chat" element={
                <AuthGuard requireAuth={true} allowedRoles={['admin']}>
                  <AdminLayout>
                    <AdminChat />
                  </AdminLayout>
                </AuthGuard>
              } />
              
              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
