import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../Provider';
import features from '../../../config/features';

// Is current page login
const isLoginPage = (router: any): boolean => {
  try {
    const { pathname = '' } = router;
    const lastPath = `${pathname
      .replace(/\/$/, '')
      .split('/')
      .pop()}`.toLowerCase();
    return lastPath === 'login';
  } catch (err) {
    return false;
  }
};

// eslint-disable-next-line
const PrivateRoute = ({ children, fallback }) => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const redirectToLogin = () => {
    if (features.supportBetaLogin) {
      router.push('/login');
    } else {
      window.location.href = '/login';
    }
  };

  useEffect(() => {
    if (!isAuthenticated && !isLoginPage(router) && !isLoading) {
      redirectToLogin();
    }
  }, [isAuthenticated, router.pathname, isLoading]); // eslint-disable-line

  if (!isAuthenticated && !isLoginPage(router)) {
    return fallback || <p>Loading...</p>;
  }

  return children;
};

export default PrivateRoute;
