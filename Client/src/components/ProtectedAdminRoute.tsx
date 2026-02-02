import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router';
import { Spinner } from './ui/Spinner';
import NotAuthorizedPage from '@/pages/NotAuthorizedPage';



const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  let navigate = useNavigate();
  const { user, loading } = useAuth();

  if (loading) {
    return <Spinner />;
  }

  if (!user) {
    navigate('/login');
  }

  if (user?.role !== 'ADMIN') {
    return <NotAuthorizedPage />;
  }
  return children;
};

export default ProtectedAdminRoute;
