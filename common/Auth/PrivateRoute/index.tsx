import { useEffect } from 'react';
import { useRouter } from 'next/router';
import getConfig from 'next/config';
import { useAuth } from '../Provider';

const { publicRuntimeConfig } = getConfig();

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

  useEffect(() => {
    if (!isAuthenticated && !isLoginPage(router) && !isLoading) {
      router.push(`${publicRuntimeConfig.basePath || '/'}login`);
    }
  }, [isAuthenticated, router.pathname, isLoading]); // eslint-disable-line

  if (!isAuthenticated && !isLoginPage(router)) {
    return fallback || <p>Loading...</p>;
  }

  return children;
};

export default PrivateRoute;
