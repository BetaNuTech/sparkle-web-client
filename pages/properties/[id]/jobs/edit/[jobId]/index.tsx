import 'firebase/firestore';
import { ReactElement } from 'react';
import { useRouter } from 'next/router';
import { useUser, useFirestore } from 'reactfire';
import { MainLayout } from '../../../../../../common/MainLayout';
import JobEdit from '../../../../../../features/JobEdit';
import useFirestoreUser from '../../../../../../common/hooks/useFirestoreUser';

const PropertiesDetailsPage: React.FC = (): ReactElement => {
  const firestore = useFirestore();
  const { data: authUser } = useUser();
  const router = useRouter();
  const { jobId, id } = router.query;
  const { data: user } = useFirestoreUser(firestore, authUser.uid || '');
  const propertyId = typeof id === 'string' ? id : id[0];
  const jobIdFinal = typeof jobId === 'string' ? jobId : jobId[0];

  return (
    <MainLayout>
      {user && (
        <JobEdit user={user} propertyId={propertyId} jobId={jobIdFinal} />
      )}
    </MainLayout>
  );
};

export default PropertiesDetailsPage;
