import 'firebase/firestore';
import { ReactElement } from 'react';
import Router, { useRouter } from 'next/router';
import { useUser, useFirestore } from 'reactfire';
import { MainLayout } from '../../../common/MainLayout';
import { canCreateInspection } from '../../../common/utils/userPermissions';
import CreateInspection from '../../../features/CreateInspection';
import useFirestoreUser from '../../../common/hooks/useFirestoreUser';

const PropertiesDetailsPage: React.FC = (): ReactElement => {
  const firestore = useFirestore();
  const { data: authUser } = useUser();
  const router = useRouter();
  const { id } = router.query;
  const { data: user } = useFirestoreUser(firestore, authUser.uid || '');
  const propertyId = typeof id === 'string' ? id : id[0];

  // Redirect user without permission to
  // create inspections for this property
  if (user && propertyId && !canCreateInspection(user, propertyId)) {
    Router.push(`/properties/${propertyId}`);
  }

  return (
    <MainLayout>
      {user && <CreateInspection user={user} propertyId={propertyId} />}
    </MainLayout>
  );
};

export default PropertiesDetailsPage;
