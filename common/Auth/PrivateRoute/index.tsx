import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../Provider';
import features from '../../../config/features';
import winLocation from '../../utils/winLocation';

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

// Is current page ios
const isIOSPage = (router: any): boolean => {
  try {
    const { pathname = '' } = router;
    const lastPath = `${pathname
      .replace(/\/$/, '')
      .split('/')
      .pop()}`.toLowerCase();
    return lastPath === 'ios';
  } catch (err) {
    return false;
  }
};

// eslint-disable-next-line
const PrivateRoute = ({ children, fallback }) => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const redirectToLogin = () => {
    const encodedUrl = encodeURIComponent(window.location.href);
    if (features.supportLogin) {
      router.replace({
        pathname: '/login',
        query: { request: encodedUrl }
      });
    } else {
      window.location.href = `/login?request=${encodedUrl}`;
    }
  };

  useEffect(() => {
    if (
      !isAuthenticated &&
      !isLoginPage(router) &&
      !isIOSPage(router) &&
      !isLoading
    ) {
      redirectToLogin();
    }
    if (isAuthenticated && isLoginPage(router)) {
      // redirect if user already authenticated
      // with full page referesh
      // to load all session related data
      winLocation.setHref('/properties');
    }
  }, [isAuthenticated, router.pathname, isLoading]); // eslint-disable-line

  if (!isAuthenticated && !isLoginPage(router) && !isIOSPage(router)) {
    return fallback || <p>Loading...</p>;
  }

  return children;
};

export default PrivateRoute;
