
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
    if (loading) return;

    if (requireAuth && !session) {
      navigate(redirectTo, { replace: true });
      return;
    }

    if (allowedRoles.length > 0 && profile && !allowedRoles.includes(profile.role)) {
      navigate('/', { replace: true });
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

  if (allowedRoles.length > 0 && profile && !allowedRoles.includes(profile.role)) {
    return null;
  }

  return <>{children}</>;
};
