import { ReactElement } from 'react';
import Router from 'next/router';

const PropertiesDetailsPage: React.FC = (): ReactElement => {
  Router.push('/properties');
  return <h1>404 - Page Not Found</h1>;
};

export default PropertiesDetailsPage;
