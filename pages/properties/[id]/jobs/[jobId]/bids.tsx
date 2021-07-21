import 'firebase/firestore';
import { ReactElement } from 'react';
import Router, { useRouter } from 'next/router';
import { useUser, useFirestore } from 'reactfire';
import { MainLayout } from '../../../../../common/MainLayout';
import { canAccessBids } from '../../../../../common/utils/userPermissions';
import JobBids from '../../../../../features/JobBids';
import useFirestoreUser from '../../../../../common/hooks/useFirestoreUser';

const PropertiesDetailsPage: React.FC = (): ReactElement => {
  const firestore = useFirestore();
  const { data: authUser } = useUser();
  const router = useRouter();
  const { jobId, id } = router.query;
  const { data: user } = useFirestoreUser(firestore, authUser.uid || '');
  const propertyId = typeof id === 'string' ? id : id[0];
  const jobIdFinal = typeof jobId === 'string' ? jobId : jobId[0];

  // Redirect user without permission to
  // jobs list for this property
  if (user && propertyId && !canAccessBids(user, propertyId)) {
    Router.push(`/properties/${propertyId}/jobs`);
  }

  return (
    <MainLayout>
      {user && (
        <JobBids user={user} propertyId={propertyId} jobId={jobIdFinal} />
      )}
    </MainLayout>
  );
};

export default PropertiesDetailsPage;
