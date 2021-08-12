import 'firebase/firestore';
import { ReactElement } from 'react';
import Router, { useRouter } from 'next/router';
import { useUser, useFirestore } from 'reactfire';
import { MainLayout } from '../../../../../../common/MainLayout';
import { canAccessBids } from '../../../../../../common/utils/userPermissions';
import BidEdit from '../../../../../../features/BidEdit';
import useFirestoreUser from '../../../../../../common/hooks/useFirestoreUser';

const Page: React.FC = (): ReactElement => {
  const firestore = useFirestore();
  const { data: authUser } = useUser();
  const router = useRouter();
  const { bidId, jobId, id } = router.query;
  const { data: user } = useFirestoreUser(firestore, authUser.uid || '');
  const propertyId = typeof id === 'string' ? id : id[0];
  const jobIdFinal = typeof jobId === 'string' ? jobId : jobId[0];
  const bidIdFinal = typeof bidId === 'string' ? bidId : bidId[0];

  // Redirect user without permission to
  // jobs list for this property
  if (user && propertyId && !canAccessBids(user, propertyId)) {
    Router.push(`/properties/${propertyId}/jobs`);
  }

  return (
    <MainLayout>
      {user && (
        <BidEdit
          user={user}
          propertyId={propertyId}
          jobId={jobIdFinal}
          bidId={bidIdFinal}
        />
      )}
    </MainLayout>
  );
};

export default Page;
