import 'firebase/firestore';
import { ReactElement } from 'react';
import { useRouter } from 'next/router';
import { useUser, useFirestore } from 'reactfire';
import { MainLayout } from '../../common/MainLayout';
import PropertyProfile from '../../features/PropertyProfile';
import useFirestoreUser from '../../common/hooks/useFirestoreUser';

const Page: React.FC = (): ReactElement => {
  const firestore = useFirestore();
  const { data: authUser } = useUser();
  const router = useRouter();
  const { id } = router.query;
  const { data: user } = useFirestoreUser(firestore, authUser.uid || '');
  const propertyId = typeof id === 'string' ? id : id[0];
  return (
    <MainLayout>
      {user && <PropertyProfile user={user} id={propertyId} />}
    </MainLayout>
  );
};

export default Page;
