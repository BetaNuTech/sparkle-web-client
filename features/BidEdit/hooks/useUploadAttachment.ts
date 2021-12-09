import firebase from 'firebase/app';
import { useState, ChangeEvent } from 'react';
import bidModel from '../../../common/models/bid';
import useStorage, { StorageResult } from '../../../common/hooks/useStorage';
import uploadAttachmentService from '../services/uploadAttachment';
import errorReports from '../../../common/services/api/errorReports';

interface Returned {
  isUploading: boolean;
  onUploadFile(
    ev: ChangeEvent<HTMLInputElement>,
    propertyId: string,
    jobId: string,
    bidId: string
  ): void;
}

const PREFIX = 'feature: BidEdit:';

type userNotifications = (message: string, options?: any) => any;
// Query inspection to delete
// and send delete confirmation
/* eslint-disable */
const useUploadAttachment = (
  fireStore: firebase.firestore.Firestore,
  bid: bidModel,
  sendNotification: userNotifications
): Returned => {
  /* eslint-enable */

  const [isUploading, setIsUploading] = useState(false);
  const { uploadFileToStorage } = useStorage();

  const onUploadFile = async (
    ev: ChangeEvent<HTMLInputElement>,
    propertyId: string,
    jobId: string,
    bidId: string
  ) => {
    const fileEl = ev.target;
    if (!fileEl.files || fileEl.files.length === 0) {
      return;
    }
    // Set loading state
    setIsUploading(true);

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
        `${PREFIX} onUploadFile: failed to upload to storage: ${err}`
      );
      // Send notification if storage api fails
      sendNotification(
        'Upload failed, please try again or upload a different file',
        { type: 'error' }
      );
      // Also send the error report to backend
      // eslint-disable-next-line import/no-named-as-default-member
      errorReports.send(wrappedErr);
      return setIsUploading(false);
    }

    // Perform the updation on bid record for new attachment uploaded
    try {
      await uploadAttachmentService.updateBidAttachment(
        fireStore,
        bid,
        file,
        result
      );
    } catch (err) {
      // Handle error
      const wrappedErr = Error(
        `${PREFIX} onUploadFile: failed to update bid attachment: ${err}`
      );
      sendNotification('Upload failed, could not update attachment record', {
        type: 'error'
      });
      errorReports.send(wrappedErr); // eslint-disable-line
    }
    // Update loading state to false
    setIsUploading(false);
  };

  return {
    isUploading,
    onUploadFile
  };
};

export default useUploadAttachment;
