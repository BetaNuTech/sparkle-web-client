import '../styles/app.scss';
import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../app/store';
import { ProvideAuth } from '../navigation/Auth/AuthProvider';
import { PrivateRoute } from '../navigation/Auth/PrivateRoute';
import { NextHeader } from '../common/NextHeader';

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

export default MyApp;
