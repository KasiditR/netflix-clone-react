import { useAuthStore } from '@/store/authUser';
import { Navigate } from 'react-router';
import { JSX } from 'react/jsx-runtime';

interface ProtectedRouteProps {
  element?: JSX.Element;
  fallback?: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  element,
  fallback,
}) => {
  const { user } = useAuthStore() as { user: any };

  return (user ? element : fallback) || <Navigate to="/" replace />;
};

export default ProtectedRoute;
