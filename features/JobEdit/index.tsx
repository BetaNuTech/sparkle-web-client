import { FunctionComponent, useState } from 'react';
import { useFirestore } from 'reactfire';
import Router from 'next/router';
import LoadingHud from '../../common/LoadingHud';
import useProperty from '../../common/hooks/useProperty';
import userModel from '../../common/models/user';
import useJob from '../../common/hooks/useJob';
import useJobBids from '../../common/hooks/useJobBids';
import useNotifications from '../../common/hooks/useNotifications'; // eslint-disable-line
import notifications from '../../common/services/notifications'; // eslint-disable-line
import useJobForm from './hooks/useJobForm';
import useJobStatus from './hooks/useJobStatus';
import useAttachmentChange from './hooks/useAttachmentChange';
import useAttachmentDelete from './hooks/useAttachmentDelete';
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
  user,
  propertyId,
  jobId,
  isOnline,
  isStaging,
  toggleNavOpen
}) => {
  const firestore = useFirestore();
  const isNewJob = jobId === 'new';

  const [isDeleteTrelloCardPromptVisible, setDeleteTrelloCardPromptVisible] =
    useState(false);

  /* eslint-disable */
  const sendNotification = notifications.createPublisher(useNotifications());
  /* eslint-enable */

  // Fetch the data of property profile
  const { data: property } = useProperty(firestore, propertyId);

  // Fetch the data of job
  const { data: job, status: jobStatus } = useJob(firestore, jobId);

  const { apiState, postJobCreate, putJobUpdate } = useJobForm(job);
  // Show job error status
  useJobStatus(apiState, jobId, propertyId, sendNotification);

  // Fetch bids related to jobs
  const { data: bids } = useJobBids(firestore, jobId);

  const { uploadState, onFileChange } = useAttachmentChange(
    firestore,
    propertyId,
    jobId,
    sendNotification
  );

  const {
    isDeleteAttachmentPromptVisible,
    currentAttachment,
    deleteAtachmentLoading,
    onDeleteAttachment,
    onConfirmAttachmentDelete,
    setDeleteAttachmentPromptVisible
  } = useAttachmentDelete(firestore, jobId, sendNotification);

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
      user={user}
      property={property}
      isOnline={isOnline}
      isStaging={isStaging}
      toggleNavOpen={toggleNavOpen}
      job={jobData}
      bids={bids}
      isNewJob={isNewJob}
      apiState={apiState}
      postJobCreate={postJobCreate}
      putJobUpdate={putJobUpdate}
      onFileChange={onFileChange}
      uploadState={uploadState}
      setDeleteAttachmentPromptVisible={setDeleteAttachmentPromptVisible}
      onDeleteAttachment={onDeleteAttachment}
      isDeleteAttachmentPromptVisible={isDeleteAttachmentPromptVisible}
      confirmAttachmentDelete={onConfirmAttachmentDelete}
      currentAttachment={currentAttachment}
      deleteAtachmentLoading={deleteAtachmentLoading}
      sendNotification={sendNotification}
      setDeleteTrelloCardPromptVisible={setDeleteTrelloCardPromptVisible}
      isDeleteTrelloCardPromptVisible={isDeleteTrelloCardPromptVisible}
    />
  );
};

JobNew.defaultProps = {};

export default JobNew;
