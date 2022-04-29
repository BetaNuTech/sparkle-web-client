import { useEffect } from 'react';
import { AppProps } from 'next/app';
import Script from 'next/script';
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
import currentUser from '../common/utils/currentUser';
import copyTextToClipboard from '../common/utils/copyTextToClipboard';
import '../styles/app.scss';

const GA4_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS;

// Copy Firebase Auth token to clipboard
const getSparkleApiToken = async () => {
  let authToken = '';
  try {
    authToken = await currentUser.getIdToken();
    authToken = `FB-JWT ${authToken}`;
  } catch (err) {
    /* eslint-disable no-console */
    console.error(
      Error(`auth token requested before user session started: ${err}`)
    ); /* eslint-enable */
  }

  if (authToken) {
    copyTextToClipboard(authToken);
    console.log(authToken); // eslint-disable-line
  }
};

function App({ Component, pageProps }: AppProps): JSX.Element {
  const router = useRouter();

  // Export the auth token method to global scope
  if (typeof window !== 'undefined') {
    window.getSparkleApiToken = getSparkleApiToken;
  }

  useEffect(() => {
    const handleRouteChange = (url) => {
      if (GA4_MEASUREMENT_ID) gtag.pageview(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      {/* Global Site Tag (gtag.js) - Google Analytics */}
      {GA4_MEASUREMENT_ID && (
        <>
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`}
          />
          <Script
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA4_MEASUREMENT_ID}', {
                  page_path: window.location.pathname,
                });
              `
            }}
          />
        </>
      )}
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
    </>
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

export default App;
