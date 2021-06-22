import { ReactElement } from 'react';
import { useUser } from 'reactfire';
import { MainLayout } from '../../common/MainLayout';
import PropertyProfile from '../../features/PropertyProfile';
import useFirestoreUser from '../../common/hooks/useFirestoreUser';

const PropertiesDetailsPage: React.FC = (): ReactElement => {
  const { data: authUser } = useUser();
  const { data: user } = useFirestoreUser(authUser.uid || '');
  return <MainLayout>{user && <PropertyProfile user={user} />}</MainLayout>;
};

export default PropertiesDetailsPage;
