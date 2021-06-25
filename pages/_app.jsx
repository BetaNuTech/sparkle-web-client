import { FirebaseAppProvider } from 'reactfire';
import { ToastProvider } from 'react-toast-notifications';
import '../styles/app.scss';
import { ProvideAuth } from '../navigation/Auth/AuthProvider';
import { PrivateRoute } from '../navigation/Auth/PrivateRoute';
import { NextHeader } from '../common/NextHeader';
import sendErrorReport from '../common/services/api/errorReports';
import firebaseConfig from '../config/firebase';

function MyApp({ Component, pageProps }) {
  return (
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <ToastProvider>
        <ProvideAuth>
          <PrivateRoute>
            <NextHeader />
            <Component {...pageProps} />
          </PrivateRoute>
        </ProvideAuth>
      </ToastProvider>
    </FirebaseAppProvider>
  );
}

// Global unhandled error reporting
if (typeof window !== 'undefined') {
  window.onunhandledrejection = (err) => {
    try {
      sendErrorReport(Error(`Unhandled Error: ${err}`));
    } catch (e) {
      // ignore further errors
    }
  };
}

export default MyApp;
