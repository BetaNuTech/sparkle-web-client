import 'firebase/firestore';
import { ReactElement } from 'react';
import { useRouter } from 'next/router';
import { useUser, useFirestore } from 'reactfire';
import { MainLayout } from '../../../../../../common/MainLayout';
import JobEdit from '../../../../../../features/JobEdit';
import useFirestoreUser from '../../../../../../common/hooks/useFirestoreUser';
import useNotifications from '../../../../../../common/hooks/useNotifications'; // eslint-disable-line
import notifications from '../../../../../../common/services/notifications'; // eslint-disable-line
import useProperty from '../../../../../../common/hooks/useProperty';
import useJob from '../../../../../../common/hooks/useJob';
import useJobBids from '../../../../../../common/hooks/useJobBids';
import LoadingHud from '../../../../../../common/LoadingHud';

const Page: React.FC = (): ReactElement => {
  const firestore = useFirestore();
  const { data: authUser } = useUser();
  const router = useRouter();
  const { jobId, id } = router.query;
  const { data: user, status: userStatus } = useFirestoreUser(
    firestore,
    authUser.uid || ''
  );
  const propertyId = typeof id === 'string' ? id : id[0];
  const jobIdFinal = typeof jobId === 'string' ? jobId : jobId[0];

  /* eslint-disable */
  const sendNotification = notifications.createPublisher(useNotifications());
  /* eslint-enable */

  // Fetch the data of property profile
  const { data: property, status: propertyStatus } = useProperty(
    firestore,
    propertyId
  );

  const isPropertyNotFound =
    propertyStatus === 'success' && Boolean(property.name) === false;

  // Redirect missing property request
  if (isPropertyNotFound) {
    sendNotification('Property not found', { type: 'error' });
    router.push('/properties/');
  }

  // Fetch the data of job
  const { data: job, status: jobStatus } = useJob(firestore, jobIdFinal);

  // Fetch bids related to jobs
  const { data: bids } = useJobBids(firestore, jobIdFinal);

  // Redirect user requesting non-existent job
  if (jobIdFinal !== 'new' && jobStatus === 'error') {
    sendNotification('Job could not be found', { type: 'error' });
    router.push(`/properties/${propertyId}/jobs`);
  }

  // Loading State
  let isLoaded = false;
  if (
    userStatus === 'success' &&
    propertyStatus === 'success' &&
    jobStatus === 'success'
  ) {
    isLoaded = true;
  }

  return (
    <MainLayout>
      {isLoaded ? (
        <JobEdit
          user={user}
          property={property}
          jobId={jobIdFinal}
          job={job}
          bids={bids}
          sendNotification={sendNotification}
        />
      ) : (
        <LoadingHud title="Loading Job" />
      )}
    </MainLayout>
  );
};

export default Page;
