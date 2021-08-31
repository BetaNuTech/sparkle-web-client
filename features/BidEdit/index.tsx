import { ChangeEvent, FunctionComponent, useState } from 'react';
import { useFirestore } from 'reactfire';
import Router from 'next/router';
import LoadingHud from '../../common/LoadingHud';
import useProperty from '../../common/hooks/useProperty';
import useJob from '../../common/hooks/useJob';
import useStorage, { StorageResult } from '../../common/hooks/useStorage';
import userModel from '../../common/models/user';
import bidAttachmentModel from '../../common/models/bidAttachment';
import useNotifications from '../../common/hooks/useNotifications'; // eslint-disable-line
import notifications from '../../common/services/notifications'; // eslint-disable-line
import errorReports from '../../common/services/api/errorReports';
import bidsDb from '../../common/services/firestore/bids';
import storage from '../../common/services/storage';
import useBid from './hooks/useBid';
import useBidForm from './hooks/useBidForm';
import useBidStatus from './hooks/useBidStatus';
import uploadAttachmentService from './services/uploadAttachment';
import useDeleteAttachment from './hooks/useDeleteAttachment';
import BidForm from './Form';

interface Props {
  user: userModel;
  propertyId: string;
  jobId: string;
  bidId: string;
  isOnline?: boolean;
  isStaging?: boolean;
  isNavOpen?: boolean;
  toggleNavOpen?(): void;
}

const PREFIX = 'feature: BidEdit:';

const BidEdit: FunctionComponent<Props> = ({
  propertyId,
  jobId,
  bidId,
  isOnline,
  isStaging,
  toggleNavOpen
}) => {
  const firestore = useFirestore();
  const isNewBid = bidId === 'new';

  /* eslint-disable */
  const sendNotification = notifications.createPublisher(useNotifications());
  /* eslint-enable */

  // Fetch the data of property profile
  const { data: property } = useProperty(firestore, propertyId);
  // Fetch the data of job
  const { data: job } = useJob(firestore, jobId);
  // Fetch the data of bid
  const { data: bid, status: bidStatus } = useBid(firestore, bidId);

  const { apiState, postBidCreate, putBidUpdate } = useBidForm(bid);

  const { uploadFileToStorage } = useStorage();

  const [uploadState, setUploadState] = useState(false);
  const [isDeleteAttachmentPromptVisible, setDeleteAttachmentPromptVisible] =
    useState(false);
  const [deleteAtachmentLoading, setDeleteAtachmentLoading] = useState(false);

  const { queueAttachmentForDelete, queuedAttachmentForDeletion } =
    useDeleteAttachment();

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
    try {
      // Upload file to the firebase storage
      result = await uploadFileToStorage(
        `/properties/${propertyId}/jobs/${jobId}/bids/${bidId}/attachments/${file.name}`,
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

    // Perform the updation on bid record for new attachment uploaded
    try {
      await uploadAttachmentService.updateBidAttachment(
        firestore,
        bid,
        file,
        result
      );
    } catch (err) {
      // Handle error
      const wrappedErr = Error(
        `${PREFIX} onFileChange: failed to update firestore attachment: ${err}`
      );
      sendNotification('Upload failed, could not update attachment record', {
        type: 'error'
      });
      errorReports.send(wrappedErr); // eslint-disable-line
    }
    // Update loading state to false
    setUploadState(false);
  };

  const onConfirmAttachmentDelete = async (attachment: bidAttachmentModel) => {
    setDeleteAtachmentLoading(true);

    try {
      await storage.deleteFile(attachment.storageRef);
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
      await bidsDb.removeBidAttachment(firestore, bidId, attachment);
    } catch (err) {
      // Handle error
      const wrappedErr = Error(
        `${PREFIX} confirmAttachmentDelete: failed to update firestore bid: ${err}`
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

  // Show job error status
  // NOTE: contains side effects: redirects, notifications, and error reporting
  // TODO: refactor away from hook to more appropriate abstraction
  useBidStatus(apiState, bidId, jobId, propertyId, sendNotification);
  // Loading State
  if (!property || !job || (bidId !== 'new' && !bid)) {
    return <LoadingHud title="Loading Bid" />;
  }

  // Redirect user requesting non-existent job
  if (bidId !== 'new' && bidStatus === 'error') {
    sendNotification('Bid could not be found', { type: 'error' });
    Router.push(`/properties/${propertyId}/jobs/${bidId}/bids`);
  }

  return (
    <BidForm
      property={property}
      isOnline={isOnline}
      isStaging={isStaging}
      toggleNavOpen={toggleNavOpen}
      job={job}
      bid={bid}
      isNewBid={isNewBid}
      apiState={apiState}
      postBidCreate={postBidCreate}
      putBidUpdate={putBidUpdate}
      onFileChange={onFileChange}
      uploadState={uploadState}
      setDeleteAttachmentPromptVisible={setDeleteAttachmentPromptVisible}
      isDeleteAttachmentPromptVisible={isDeleteAttachmentPromptVisible}
      queueAttachmentForDelete={queueAttachmentForDelete}
      queuedAttachmentForDeletion={queuedAttachmentForDeletion}
      confirmAttachmentDelete={onConfirmAttachmentDelete}
      deleteAtachmentLoading={deleteAtachmentLoading}
    />
  );
};

BidEdit.defaultProps = {};

export default BidEdit;
