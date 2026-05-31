import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const APP_ROUTES = ['/dashboard', '/builder', '/job-finder', '/chatbot', '/job-analytics', '/growth'];

/** Logged-in users stay in the app shell (dashboard area only). */
export default function AuthRedirect() {
  const { user } = useAuth();
  const { pathname } = useLocation();

  if (!user) return null;

  const onAppRoute = APP_ROUTES.includes(pathname);
  const onAuthForm = pathname === '/login' || pathname === '/register';

  if (onAuthForm || !onAppRoute) {
    return <Navigate to="/dashboard" replace />;
  }

  return null;
}
