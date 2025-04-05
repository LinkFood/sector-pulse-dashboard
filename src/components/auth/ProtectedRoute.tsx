
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        // Redirect to login with returnUrl, using the correct path
        navigate(`/login?returnUrl=${encodeURIComponent(location.pathname)}`, { replace: true });
      } else {
        setIsInitializing(false);
      }
    }
  }, [user, isLoading, navigate, location.pathname]);

  if (isLoading || isInitializing) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-80 w-full max-w-4xl" />
        <Skeleton className="h-8 w-40" />
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
