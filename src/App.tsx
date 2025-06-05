
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { AuthGuard } from "@/components/auth/AuthGuard";

// Import pages
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import SubmitComplaint from "./pages/SubmitComplaint";
import CitizenDashboard from "./pages/CitizenDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import AdminLogin from "./pages/AdminLogin";
import Complaints from "./pages/Complaints";
import ComplaintDetails from "./pages/ComplaintDetails";
import ComplaintSuccess from "./pages/ComplaintSuccess";
import EscalationForm from "./pages/EscalationForm";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

// Import admin pages
import AdminDashboardMain from "./pages/admin/AdminDashboard";
import AdminComplaints from "./pages/admin/AdminComplaints";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminServices from "./pages/admin/AdminServices";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminNotifications from "./pages/admin/AdminNotifications";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminChat from "./pages/admin/AdminChat";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: (failureCount, error: any) => {
        // Don't retry on auth errors
        if (error?.status === 401 || error?.status === 403) {
          return false;
        }
        return failureCount < 3;
      },
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
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
              
              {/* Protected admin routes */}
              <Route path="/admin-dashboard" element={
                <AuthGuard requireAuth={true} allowedRoles={['admin']}>
                  <AdminDashboard />
                </AuthGuard>
              } />
              <Route path="/admin/dashboard" element={
                <AuthGuard requireAuth={true} allowedRoles={['admin']}>
                  <AdminDashboardMain />
                </AuthGuard>
              } />
              <Route path="/admin/complaints" element={
                <AuthGuard requireAuth={true} allowedRoles={['admin']}>
                  <AdminComplaints />
                </AuthGuard>
              } />
              <Route path="/admin/users" element={
                <AuthGuard requireAuth={true} allowedRoles={['admin']}>
                  <AdminUsers />
                </AuthGuard>
              } />
              <Route path="/admin/services" element={
                <AuthGuard requireAuth={true} allowedRoles={['admin']}>
                  <AdminServices />
                </AuthGuard>
              } />
              <Route path="/admin/projects" element={
                <AuthGuard requireAuth={true} allowedRoles={['admin']}>
                  <AdminProjects />
                </AuthGuard>
              } />
              <Route path="/admin/notifications" element={
                <AuthGuard requireAuth={true} allowedRoles={['admin']}>
                  <AdminNotifications />
                </AuthGuard>
              } />
              <Route path="/admin/settings" element={
                <AuthGuard requireAuth={true} allowedRoles={['admin']}>
                  <AdminSettings />
                </AuthGuard>
              } />
              <Route path="/admin/chat" element={
                <AuthGuard requireAuth={true} allowedRoles={['admin']}>
                  <AdminChat />
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
