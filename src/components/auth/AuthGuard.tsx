
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseSession } from '@/utils/supabaseAuth';
import { Loader } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  allowedRoles?: string[];
  redirectTo?: string;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireAuth = true,
  allowedRoles = [],
  redirectTo = '/auth'
}) => {
  const { session, profile, loading } = useSupabaseSession();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('AuthGuard: Current state:', {
      loading,
      hasSession: !!session,
      profile: profile ? { id: profile.id, role: profile.role } : null,
      requireAuth,
      allowedRoles
    });

    if (loading) return;

    if (requireAuth && !session) {
      console.log('AuthGuard: No session, redirecting to:', redirectTo);
      navigate(redirectTo, { replace: true });
      return;
    }

    // If roles are required but profile is not loaded yet, wait
    if (allowedRoles.length > 0 && !profile && session) {
      console.log('AuthGuard: Waiting for profile to load...');
      return;
    }

    if (allowedRoles.length > 0 && profile && !allowedRoles.includes(profile.role)) {
      console.log('AuthGuard: Role check failed. User role:', profile.role, 'Required roles:', allowedRoles);
      
      // Redirect based on user's actual role
      if (profile.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else if (profile.role === 'staff') {
        navigate('/staff-dashboard', { replace: true });
      } else {
        navigate('/citizen-dashboard', { replace: true });
      }
      return;
    }
  }, [session, profile, loading, requireAuth, allowedRoles, navigate, redirectTo]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (requireAuth && !session) {
    return null;
  }

  // If roles are required but profile is not loaded yet, show loading
  if (allowedRoles.length > 0 && !profile && session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading user profile...</span>
      </div>
    );
  }

  if (allowedRoles.length > 0 && profile && !allowedRoles.includes(profile.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
          <p className="text-sm text-gray-500 mt-2">Your role: {profile.role}</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
