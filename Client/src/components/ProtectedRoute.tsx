import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router';
import { Spinner } from './ui/Spinner';



const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Spinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
