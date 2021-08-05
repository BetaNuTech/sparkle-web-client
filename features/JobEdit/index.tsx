import { FunctionComponent } from 'react';
import { useFirestore } from 'reactfire';
import Router from 'next/router';
import LoadingHud from '../../common/LoadingHud';
import useProperty from '../../common/hooks/useProperty';
import userModel from '../../common/models/user';
import useJob from '../../common/hooks/useJob';
import useNotifications from '../../common/hooks/useNotifications'; // eslint-disable-line
import notifications from '../../common/services/notifications'; // eslint-disable-line
import useJobForm from './hooks/useJobForm';
import useJobStatus from './hooks/useJobStatus';
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

  /* eslint-disable */
  const sendNotification = notifications.createPublisher(useNotifications());
  /* eslint-enable */

  // Fetch the data of property profile
  const { data: property } = useProperty(firestore, propertyId);
  const { apiState, postJobCreate, putJobUpdate } = useJobForm();
  // Show job error status
  useJobStatus(apiState, jobId, propertyId, sendNotification);
  // Fetch the data of job
  const { data: job, status: jobStatus } = useJob(firestore, jobId);

  // Loading State
  if (!property || (jobId !== 'new' && !job)) {
    return <LoadingHud title="Loading Job" />;
  }

  // Redirect user requesting non-existent job
  if (jobId !== 'new' && jobStatus === 'error') {
    sendNotification('Job could not be found', { type: 'error' });
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
      apiState={apiState}
      postJobCreate={postJobCreate}
      putJobUpdate={putJobUpdate}
    />
  );
};

JobNew.defaultProps = {};

export default JobNew;
