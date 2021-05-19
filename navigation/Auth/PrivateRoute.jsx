import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from './AuthProvider';

export const PrivateRoute = ({ children }) => {
  const router = useRouter();
  const { isAuthenticated, loadingStatus } = useAuth();

  useEffect(() => {
    if (!isAuthenticated && router.pathname !== '/jobs/login' && !loadingStatus) {
      router.push('/jobs/login');
    }
  }, [loadingStatus]);

  if (!isAuthenticated && router.pathname !== '/jobs/login') {
    return <div>Loading</div>;
  }

  return children;
};
