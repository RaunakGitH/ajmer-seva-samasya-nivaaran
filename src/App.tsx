
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import SubmitComplaint from "./pages/SubmitComplaint";
import ComplaintSuccess from "./pages/ComplaintSuccess";
import Complaints from "./pages/Complaints";
import ComplaintDetails from "./pages/ComplaintDetails";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/AdminLogin";
import NotFound from "./pages/NotFound";
import { AdminLayout } from "@/components/admin/AdminLayout";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminSettings from "@/pages/admin/AdminSettings";
import AdminComplaints from "@/pages/admin/AdminComplaints";
import CitizenDashboard from "@/pages/CitizenDashboard";
import StaffDashboard from "@/pages/StaffDashboard";
import Auth from "@/pages/Auth";

const queryClient = new QueryClient();

// Simple auth guard for admin routes
const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = localStorage.getItem('adminAuth') === 'true';
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" />;
  }
  
  return children;
};

// Staff auth guard
const StaffRoute = ({ children }: { children: JSX.Element }) => {
  // This is a simple implementation, ideally you would check proper role/permissions
  const isAuthenticated = localStorage.getItem('staffAuth') === 'true';
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }
  
  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Citizen Portal Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/citizen-dashboard" element={<CitizenDashboard />} />
          <Route path="/staff-dashboard" element={<StaffDashboard />} />
          <Route path="/submit-complaint" element={<SubmitComplaint />} />
          <Route path="/complaint-success" element={<ComplaintSuccess />} />
          <Route path="/complaints" element={<Complaints />} />
          <Route path="/complaint-details/:id" element={<ComplaintDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Admin Portal Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={
            <AdminRoute>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </AdminRoute>
          } />
          <Route path="/admin/users" element={
            <AdminRoute>
              <AdminLayout>
                <AdminUsers />
              </AdminLayout>
            </AdminRoute>
          } />
          <Route path="/admin/complaints" element={
            <AdminRoute>
              <AdminLayout>
                <AdminComplaints />
              </AdminLayout>
            </AdminRoute>
          } />
          <Route path="/admin/settings" element={
            <AdminRoute>
              <AdminLayout>
                <AdminSettings />
              </AdminLayout>
            </AdminRoute>
          } />

          {/* Catch-all Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
