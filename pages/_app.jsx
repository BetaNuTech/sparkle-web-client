import { useEffect } from 'react';
import { FirebaseAppProvider } from 'reactfire';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { useRouter } from 'next/router';
import AuthProvider from '../common/Auth/Provider';
import PrivateRoute from '../common/Auth/PrivateRoute';
import AppLoader from '../common/AppLoader';
import { NextHeader } from '../common/NextHeader';
import errorReports from '../common/services/api/errorReports';
import * as gtag from '../common/utils/gtag';
import firebaseConfig from '../config/firebase';
import '../styles/app.scss';

const isProduction = process.env.NODE_ENV === 'production';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      /* invoke analytics function only for production */
      if (isProduction) gtag.pageview(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      {/* Initializes Firebase */}
      <AuthProvider>
        <PrivateRoute fallback={<AppLoader />}>
          <NextHeader />
          <Component {...pageProps} />
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar
            newestOnTop={false}
            closeOnClick
            pauseOnFocusLoss={false}
            draggable
            pauseOnHover
          />
        </PrivateRoute>
      </AuthProvider>
    </FirebaseAppProvider>
  );
}

// Global unhandled error reporting
if (typeof window !== 'undefined') {
  window.onunhandledrejection = (err) => {
    try {
      // eslint-disable-next-line
      errorReports.send(Error(`Unhandled Error: ${err}`));
    } catch (e) {
      // ignore further errors
    }
  };
}

export default MyApp;
