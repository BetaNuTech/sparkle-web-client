import { FunctionComponent } from 'react';
import { useFirestore } from 'reactfire';
import Router from 'next/router';
import LoadingHud from '../../common/LoadingHud';
import useProperty from '../../common/hooks/useProperty';
import userModel from '../../common/models/user';
import useJob from '../../common/hooks/useJob';
import useNotifications from '../../common/hooks/useNotifications'; // eslint-disable-line
import notifications from '../../common/services/notifications'; // eslint-disable-line
import JobForm from './Form';

interface Props {
  user: userModel;
  propertyId: string;
  jobId: string;
  isOnline?: boolean;
  isStaging?: boolean;
  isNavOpen?: boolean;
  toggleNavOpen?(): void;
}

const JobNew: FunctionComponent<Props> = ({
  propertyId,
  jobId,
  isOnline,
  isStaging,
  toggleNavOpen
}) => {
  const firestore = useFirestore();

  // Fetch the data of property profile
  const { data: property } = useProperty(firestore, propertyId);

  // Fetch the data of job
  const {
    data: job,
    status: jobStatus,
    error: jobError
  } = jobId === 'new'
    ? { data: null, status: 'success', error: null }
    : useJob(firestore, jobId);

  // Loading State
  if (!property || (jobId !== 'new' && !job)) {
    return <LoadingHud title="Loading Job" />;
  }

  // Redirect user requesting non-existent job
  if (jobId !== 'new' && jobStatus === 'error') {
    /* eslint-disable */
    const sendNotification = notifications.createPublisher(useNotifications());
    /* eslint-enable */
    sendNotification('Job coound not be found', { type: 'error' });
    Router.push(`/properties/${propertyId}/jobs`);
  }

  const jobData = job && { ...job };

  return (
    <JobForm
      property={property}
      isOnline={isOnline}
      isStaging={isStaging}
      toggleNavOpen={toggleNavOpen}
      job={jobData}
    />
  );
};

JobNew.defaultProps = {};

export default JobNew;
