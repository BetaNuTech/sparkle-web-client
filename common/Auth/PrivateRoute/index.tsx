import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../Provider';
import features from '../../../config/features';
import winLocation from '../../utils/winLocation';

// Routes that render without a session.
//
// "privacy" and "about" must stay here: they are the privacy policy and app
// home page URLs on Google's OAuth consent screen, and brand verification
// loads both as an anonymous visitor. A home page that redirects to /login is
// refused -- which is exactly how the first verification attempt failed.
const PUBLIC_PATHS = ['login', 'ios', 'privacy', 'about'];

// Is the current route one of the public ones
const isPublicPage = (router: any): boolean => {
  try {
    const { pathname = '' } = router;
    const lastPath = `${pathname
      .replace(/\/$/, '')
      .split('/')
      .pop()}`.toLowerCase();
    return PUBLIC_PATHS.includes(lastPath);
  } catch (err) {
    return false;
  }
};

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
    if (!isAuthenticated && !isPublicPage(router) && !isLoading) {
      redirectToLogin();
    }
    if (isAuthenticated && isLoginPage(router)) {
      // redirect if user already authenticated
      // with full page referesh
      // to load all session related data
      winLocation.setHref('/properties');
    }
  }, [isAuthenticated, router.pathname, isLoading]); // eslint-disable-line

  if (!isAuthenticated && !isPublicPage(router)) {
    return fallback || <p>Loading...</p>;
  }

  return children;
};

export default PrivateRoute;
