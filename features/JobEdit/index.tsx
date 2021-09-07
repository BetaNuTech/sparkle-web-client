import { FunctionComponent, useState, ChangeEvent } from 'react';
import { useFirestore } from 'reactfire';
import Router from 'next/router';
import moment from 'moment';
import LoadingHud from '../../common/LoadingHud';
import useProperty from '../../common/hooks/useProperty';
import userModel from '../../common/models/user';
import attachmentModel from '../../common/models/attachments';
import useJob from '../../common/hooks/useJob';
import useJobBids from '../../common/hooks/useJobBids';
import useAttachment from '../../common/hooks/useAttachment';
import useStorage, { StorageResult } from '../../common/hooks/useStorage';
import useNotifications from '../../common/hooks/useNotifications'; // eslint-disable-line
import notifications from '../../common/services/notifications'; // eslint-disable-line
import errorReports from '../../common/services/api/errorReports';
import attachmentDb from '../../common/services/firestore/attachments';
import jobDb from '../../common/services/firestore/jobs';
import storage from '../../common/services/storage';
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

const PREFIX = 'feature: JobEdit:';

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
  const [uploadState, setUploadState] = useState(false);
  const [isDeleteAttachmentPromptVisible, setDeleteAttachmentPromptVisible] =
    useState(false);
  const [deleteAtachmentLoading, setDeleteAtachmentLoading] = useState(false);
  const [isDeleteTrelloCardPromptVisible, setDeleteTrelloCardPromptVisible] =
    useState(false);

  /* eslint-disable */
  const sendNotification = notifications.createPublisher(useNotifications());
  /* eslint-enable */

  // Fetch the data of property profile
  const { data: property } = useProperty(firestore, propertyId);

  // Fetch the data of job
  const { data: job, status: jobStatus } = useJob(firestore, jobId);

  const attachmentId =
    job && job.scopeOfWorkAttachment && job.scopeOfWorkAttachment.id;

  // Get attachment record
  const { data: jobAttachment } = useAttachment(firestore, attachmentId);

  const { apiState, postJobCreate, putJobUpdate } = useJobForm(job);
  // Show job error status
  useJobStatus(apiState, jobId, propertyId, sendNotification);

  // Fetch bids related to jobs
  const { data: bids } = useJobBids(firestore, jobId);

  const { uploadFileToStorage } = useStorage();

  const onFileChange = async (ev: ChangeEvent<HTMLInputElement>) => {
    const fileEl = ev.target;
    if (!fileEl.files || fileEl.files.length === 0) {
      return;
    }
    // Set loading state
    setUploadState(true);

    // Get the file from files array
    const file = fileEl.files[0];
    let result: StorageResult = null;
    let attachmentStorageId = '';
    try {
      // Upload file to the firebase storage
      result = await uploadFileToStorage(
        `/properties/${propertyId}/jobs/${jobId}/attachments/${file.name}`,
        file
      );
    } catch (err) {
      const wrappedErr = Error(
        `${PREFIX} onFileChange: failed to upload to storage: ${err}`
      );
      // Send notification if storage api fails
      sendNotification(
        'Upload failed, please try again or upload a different file',
        { type: 'error' }
      );
      // Also send the error report to backend
      // eslint-disable-next-line import/no-named-as-default-member
      errorReports.send(wrappedErr);
      return setUploadState(false);
    }

    // Add attachment record to the firestore
    try {
      const attachment: attachmentModel = {
        name: file.name,
        size: file.size,
        type: file.type,
        createdAt: moment().unix(),
        storageRef: result.fileDestination,
        url: result.fileUrl
      };
      attachmentStorageId = await attachmentDb.saveRecord(
        firestore,
        attachment
      );
    } catch (err) {
      // Handle error
      const wrappedErr = Error(
        `${PREFIX} onFileChange: failed to add firestore attachment record: ${err}`
      );
      sendNotification('Update failed, could not add attachment record', {
        type: 'error'
      });
      errorReports.send(wrappedErr); // eslint-disable-line
      return setUploadState(false);
    }

    // Update attachment reference to job
    try {
      await jobDb.updateAttachmentRef(firestore, jobId, attachmentStorageId);
    } catch (err) {
      // Handle error
      const wrappedErr = Error(
        `${PREFIX} onFileChange: failed to update firestore job record: ${err}`
      );
      sendNotification('Update failed, could not update job record', {
        type: 'error'
      });
      errorReports.send(wrappedErr); // eslint-disable-line
    }

    // Update loading state to false
    setUploadState(false);
  };

  const onConfirmAttachmentDelete = async () => {
    setDeleteAtachmentLoading(true);

    try {
      await storage.deleteFile(jobAttachment.storageRef);
    } catch (err) {
      // Handle error
      const wrappedErr = Error(
        `${PREFIX} confirmAttachmentDelete: failed to remove file from storage: ${err}`
      );
      sendNotification('Failed to delete attachment, please try again', {
        type: 'error'
      });
      errorReports.send(wrappedErr); // eslint-disable-line
      return setDeleteAtachmentLoading(false);
    }

    try {
      await jobDb.updateAttachmentRef(firestore, jobId, null);
    } catch (err) {
      // Handle error
      const wrappedErr = Error(
        `${PREFIX} confirmAttachmentDelete: failed to update firestore job record: ${err}`
      );
      sendNotification(
        'Attachment removed, but an unexpected error occurred.  Our team has been notified of this issue.',
        {
          type: 'error'
        }
      );
      errorReports.send(wrappedErr); // eslint-disable-line
    }

    setDeleteAtachmentLoading(false);
  };

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
      jobAttachment={jobAttachment}
      setDeleteAttachmentPromptVisible={setDeleteAttachmentPromptVisible}
      isDeleteAttachmentPromptVisible={isDeleteAttachmentPromptVisible}
      confirmAttachmentDelete={onConfirmAttachmentDelete}
      deleteAtachmentLoading={deleteAtachmentLoading}
      sendNotification={sendNotification}
      setDeleteTrelloCardPromptVisible={setDeleteTrelloCardPromptVisible}
      isDeleteTrelloCardPromptVisible={isDeleteTrelloCardPromptVisible}
    />
  );
};

JobNew.defaultProps = {};

export default JobNew;
