import 'firebase/firestore';
import { ReactElement } from 'react';
import Router, { useRouter } from 'next/router';
import { useUser, useFirestore } from 'reactfire';
import { MainLayout } from '../../../common/MainLayout';
import { canAccessJobs } from '../../../common/utils/userPermissions';
import useProperty from '../../../common/hooks/useProperty';
import usePropertyJobs from '../../../common/hooks/usePropertyJobs';
import LoadingHud from '../../../common/LoadingHud';
import JobList from '../../../features/JobList';
import useFirestoreUser from '../../../common/hooks/useFirestoreUser';
import useNotifications from '../../../common/hooks/useNotifications';
import notifications from '../../../common/services/notifications';

const Page: React.FC = (): ReactElement => {
  const firestore = useFirestore();
  // eslint-disable-next-line
  const sendNotification = notifications.createPublisher(useNotifications());
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

  // Fetch the data of property profile
  const { data: property, status: propertyStatus } = useProperty(
    firestore,
    propertyId
  );

  // Fetch all jobs for property
  const { status: jobStatus, data: jobs } = usePropertyJobs(
    firestore,
    propertyId
  );

  // Loading State
  let isLoaded = false;
  if (propertyStatus === 'success' && jobStatus === 'success') {
    isLoaded = true;
  }

  const isPropertyNotFound =
    propertyStatus === 'success' && Boolean(property.name) === false;

  // Redirect missing property request
  if (isPropertyNotFound) {
    sendNotification('Property not found', { type: 'error' });
    Router.push('/properties');
  }

  return (
    <MainLayout user={user}>
      {isLoaded ? (
        <JobList
          user={user}
          property={property}
          jobs={jobs}
          jobStatus={jobStatus}
        />
      ) : (
        <LoadingHud title="Loading Jobs" />
      )}
    </MainLayout>
  );
};

export default Page;
