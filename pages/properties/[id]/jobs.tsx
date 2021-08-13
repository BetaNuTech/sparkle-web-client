import 'firebase/firestore';
import { ReactElement } from 'react';
import Router, { useRouter } from 'next/router';
import { useUser, useFirestore } from 'reactfire';
import { MainLayout } from '../../../common/MainLayout';
import { canAccessJobs } from '../../../common/utils/userPermissions';
import JobList from '../../../features/JobList';
import useFirestoreUser from '../../../common/hooks/useFirestoreUser';

const Page: React.FC = (): ReactElement => {
  const firestore = useFirestore();
  const { data: authUser } = useUser();
  const router = useRouter();
  const { id } = router.query;
  const { data: user } = useFirestoreUser(firestore, authUser.uid || '');
  const propertyId = typeof id === 'string' ? id : id[0];

  // Redirect user without permission to
  // jobs list for this property
  if (user && propertyId && !canAccessJobs(user, propertyId)) {
    Router.push(`/properties/${propertyId}`);
  }

  return (
    <MainLayout>
      {user && <JobList user={user} propertyId={propertyId} />}
    </MainLayout>
  );
};

export default Page;
