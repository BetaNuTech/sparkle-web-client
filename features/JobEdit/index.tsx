import { FunctionComponent, useState } from 'react';
import { useFirestore } from 'reactfire';
import userModel from '../../common/models/user';
import propertyModel from '../../common/models/property';
import jobModel from '../../common/models/job';
import bidModel from '../../common/models/bid';
import useJobForm from './hooks/useJobForm';
import useAttachmentChange from './hooks/useAttachmentChange';
import useAttachmentDelete from './hooks/useAttachmentDelete';
import JobForm from './Form';

type userNotifications = (message: string, options?: any) => any;

interface Props {
  user: userModel;
  property: propertyModel;
  job: jobModel;
  jobId: string;
  bids: Array<bidModel>;
  sendNotification: userNotifications;
  isOnline?: boolean;
  isStaging?: boolean;
  isNavOpen?: boolean;
  toggleNavOpen?(): void;
}

const JobNew: FunctionComponent<Props> = ({
  user,
  property,
  job,
  bids,
  jobId,
  sendNotification,
  isOnline,
  isStaging,
  toggleNavOpen
}) => {
  const firestore = useFirestore();
  const isNewJob = jobId === 'new';

  const [isDeleteTrelloCardPromptVisible, setDeleteTrelloCardPromptVisible] =
    useState(false);

  const { isLoading, error, postJobCreate, putJobUpdate } =
    useJobForm(sendNotification);

  const { uploadState, onFileChange } = useAttachmentChange(
    firestore,
    property.id,
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

  const jobData = job && { ...job };

  return (
    <JobForm
      user={user}
      property={property}
      isOnline={isOnline}
      isStaging={isStaging}
      toggleNavOpen={toggleNavOpen}
      job={jobData}
      jobId={jobId}
      bids={bids}
      isNewJob={isNewJob}
      isLoading={isLoading}
      error={error}
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
