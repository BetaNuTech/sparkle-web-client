import { FirebaseAppProvider } from 'reactfire';
import { ToastProvider } from 'react-toast-notifications';
import AuthProvider from '../common/Auth/Provider';
import PrivateRoute from '../common/Auth/PrivateRoute';
import { NextHeader } from '../common/NextHeader';
import errorReports from '../common/services/api/errorReports';
import firebaseConfig from '../config/firebase';
import '../styles/app.scss';

function MyApp({ Component, pageProps }) {
  return (
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <ToastProvider>
        {/* Initializes Firebase */}
        <AuthProvider>
          <PrivateRoute>
            <NextHeader />
            <Component {...pageProps} />
          </PrivateRoute>
        </AuthProvider>
      </ToastProvider>
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
