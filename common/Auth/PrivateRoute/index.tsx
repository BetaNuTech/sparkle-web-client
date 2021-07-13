import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../Provider';

// eslint-disable-next-line
const PrivateRoute = ({ children, fallback }) => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isAuthenticated && router.pathname !== '/login' && !isLoading) {
      router.push('/login');
    }
  }, [isAuthenticated, router.pathname, isLoading]); // eslint-disable-line

  if (!isAuthenticated && router.pathname !== '/login') {
    return fallback || <p>Loading...</p>;
  }

  return children;
};

export default PrivateRoute;
