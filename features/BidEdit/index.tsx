import { useFirestore } from 'reactfire';
import { ChangeEvent, FunctionComponent, useState } from 'react';
import propertyModel from '../../common/models/property';
import jobModel from '../../common/models/job';
import bidModel from '../../common/models/bid';
import useStorage, { StorageResult } from '../../common/hooks/useStorage';
import attachmentModel from '../../common/models/attachment';
import useNotifications from '../../common/hooks/useNotifications'; // eslint-disable-line
import notifications from '../../common/services/notifications';
import errorReports from '../../common/services/api/errorReports';
import bidsDb from '../../common/services/firestore/bids';
import storage from '../../common/services/storage';
import useBidForm from './hooks/useBidForm';
import uploadAttachmentService from './services/uploadAttachment';
import useDeleteAttachment from './hooks/useDeleteAttachment';
import BidForm from './Form';

interface Props {
  isNewBid: boolean;
  property: propertyModel;
  job: jobModel;
  bid: bidModel;
  otherBids: Array<bidModel>;
  isOnline?: boolean;
  isStaging?: boolean;
  isNavOpen?: boolean;
  toggleNavOpen?(): void;
}

const PREFIX = 'feature: BidEdit:';

const BidEdit: FunctionComponent<Props> = ({
  isNewBid,
  property,
  job,
  otherBids,
  bid,
  isOnline,
  isStaging,
  toggleNavOpen
}) => {
  const bidId = bid.id;
  const propertyId = property.id;
  const jobId = job.id;
  const db = useFirestore();

  // eslint-disable-next-line
  const sendNotification = notifications.createPublisher(useNotifications());

  // Get current bid from bids array
  const { apiState, postBidCreate, putBidUpdate } = useBidForm(
    bid,
    sendNotification
  );
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
      await uploadAttachmentService.updateBidAttachment(db, bid, file, result);
    } catch (err) {
      // Handle error
      const wrappedErr = Error(
        `${PREFIX} onFileChange: failed to update bid attachment: ${err}`
      );
      sendNotification('Upload failed, could not update attachment record', {
        type: 'error'
      });
      errorReports.send(wrappedErr); // eslint-disable-line
    }
    // Update loading state to false
    setUploadState(false);
  };

  const onConfirmAttachmentDelete = async (attachment: attachmentModel) => {
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
      await bidsDb.removeBidAttachment(db, bidId, attachment);
    } catch (err) {
      // Handle error
      const wrappedErr = Error(
        `${PREFIX} confirmAttachmentDelete: failed to update bid: ${err}`
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

  return (
    <BidForm
      property={property}
      isOnline={isOnline}
      isStaging={isStaging}
      toggleNavOpen={toggleNavOpen}
      job={job}
      bid={bid}
      otherBids={otherBids}
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

BidEdit.defaultProps = {
  isOnline: false,
  isStaging: false,
  isNavOpen: false,
  toggleNavOpen: () => {} // eslint-disable-line
};

export default BidEdit;
