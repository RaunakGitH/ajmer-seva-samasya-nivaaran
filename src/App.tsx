import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import SubmitComplaint from "./pages/SubmitComplaint";
import ComplaintSuccess from "./pages/ComplaintSuccess";
import Complaints from "./pages/Complaints";
import AdminLogin from "./pages/AdminLogin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Simple auth guard for admin routes
const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = localStorage.getItem('adminAuth') === 'true';
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" />;
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
          <Route path="/submit-complaint" element={<SubmitComplaint />} />
          <Route path="/complaint-success" element={<ComplaintSuccess />} />
          <Route path="/complaints" element={<Complaints />} />
          
          {/* Admin Portal Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* Protected Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <div className="min-h-screen flex items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
                    <p className="text-gray-600">This would be the admin dashboard UI</p>
                  </div>
                </div>
              </AdminRoute>
            }
          />
          
          {/* Catch-all Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
