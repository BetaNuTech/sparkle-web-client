import 'firebase/firestore';
import { ReactElement } from 'react';
import Router, { useRouter } from 'next/router';
import { useUser, useFirestore } from 'reactfire';
import { MainLayout } from '../../../../../../common/MainLayout';
import { canAccessBids } from '../../../../../../common/utils/userPermissions';
import JobBids from '../../../../../../features/JobBids';
import useFirestoreUser from '../../../../../../common/hooks/useFirestoreUser';
import useProperty from '../../../../../../common/hooks/useProperty';
import useJob from '../../../../../../common/hooks/useJob';
import useJobBids from '../../../../../../common/hooks/useJobBids';
import LoadingHud from '../../../../../../common/LoadingHud';
import useNotifications from '../../../../../../common/hooks/useNotifications';
import notifications from '../../../../../../common/services/notifications';

const Page: React.FC = (): ReactElement => {
  const firestore = useFirestore();
  // eslint-disable-next-line
  const sendNotification = notifications.createPublisher(useNotifications());
  const { data: authUser } = useUser();
  const router = useRouter();
  const { jobId, id } = router.query;
  const { data: user, status: userStatus } = useFirestoreUser(
    firestore,
    authUser.uid || ''
  );
  const propertyId = typeof id === 'string' ? id : id[0];
  const jobIdFinal = typeof jobId === 'string' ? jobId : jobId[0];

  // Redirect user without permission to
  // jobs list for this property
  if (user && propertyId && !canAccessBids(user, propertyId)) {
    Router.push(`/properties/${propertyId}/jobs`);
  }

  // Fetch the data of property profile
  const { data: property, status: propertyStatus } = useProperty(
    firestore,
    propertyId
  );

  // Fetch the data of job
  const { data: job, status: jobStatus } = useJob(firestore, jobIdFinal);

  // Fetch all jobs for property
  const { data: bids, status: bidStatus } = useJobBids(firestore, jobIdFinal);

  // Loading State
  let isLoaded = false;
  if (
    userStatus === 'success' &&
    propertyStatus === 'success' &&
    jobStatus === 'success'
  ) {
    isLoaded = true;
  }

  const isPropertyNotFound =
    propertyStatus === 'success' && Boolean(property.name) === false;
  const isJobNotFound = jobStatus === 'success' && Boolean(job.state) === false;

  // Redirect missing property request
  if (isPropertyNotFound) {
    sendNotification('Property not found', { type: 'error' });
    Router.push('/properties/');
  }

  // Redirect missing job request
  if (isJobNotFound) {
    sendNotification('Job not found', { type: 'error' });
    Router.push(`/properties/${propertyId}/jobs/`);
  }

  return (
    <MainLayout user={user}>
      {isLoaded ? (
        <JobBids
          user={user}
          property={property}
          job={job}
          bids={bids}
          bidStatus={bidStatus}
        />
      ) : (
        <LoadingHud title="Loading Bids" />
      )}
    </MainLayout>
  );
};

export default Page;
