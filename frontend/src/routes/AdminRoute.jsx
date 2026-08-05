import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Loader from '../components/Loader/Loader';
import { ROUTES } from '../constants/routes';

const AdminRoute = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loader fullScreen />;

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to={ROUTES.ADMIN_LOGIN} state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
