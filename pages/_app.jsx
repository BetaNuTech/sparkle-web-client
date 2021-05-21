import '../styles/app.scss';
import React from 'react';
import { ProvideAuth } from '../navigation/Auth/AuthProvider';
import { PrivateRoute } from '../navigation/Auth/PrivateRoute';
import { NextHeader } from '../components/common/NextHeader';

function MyApp({ Component, pageProps }) {
  return (
    <ProvideAuth>
      <PrivateRoute>
        <NextHeader />
        <Component {...pageProps} />
      </PrivateRoute>
    </ProvideAuth>
  );
}

export default MyApp;
