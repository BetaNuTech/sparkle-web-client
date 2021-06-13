import '../styles/app.scss';
import { Provider } from 'react-redux';
import { store } from '../app/store';
import { ProvideAuth } from '../navigation/Auth/AuthProvider';
import { PrivateRoute } from '../navigation/Auth/PrivateRoute';
import { NextHeader } from '../common/NextHeader';
import sendErrorReport from '../common/services/api/errorReports';

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <ProvideAuth>
        <PrivateRoute>
          <NextHeader />
          <Component {...pageProps} />
        </PrivateRoute>
      </ProvideAuth>
    </Provider>
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
