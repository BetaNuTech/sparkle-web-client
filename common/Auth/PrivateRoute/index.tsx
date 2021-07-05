import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../Provider';

// eslint-disable-next-line
const PrivateRoute = ({ children }) => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isAuthenticated && router.pathname !== '/login' && !isLoading) {
      router.push('/login');
    }
  }, [isAuthenticated, router.pathname, isLoading]); // eslint-disable-line

  if (!isAuthenticated && router.pathname !== '/login') {
    // TODO setting loading UI
    return <div>Loading</div>;
  }

  return children;
};

export default PrivateRoute;
