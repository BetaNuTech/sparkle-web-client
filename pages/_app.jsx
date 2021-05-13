import React from 'react';
import { ProvideAuth } from '../navigation/Auth/AuthProvider';
import { PrivateRoute } from '../navigation/Auth/PrivateRoute';

function MyApp({ Component, pageProps }) {
	return (
		<ProvideAuth>
			<PrivateRoute>
				<Component {...pageProps} />
			</PrivateRoute>
		</ProvideAuth>
	);
}

export default MyApp;
