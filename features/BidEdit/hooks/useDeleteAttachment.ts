import firebase from 'firebase/app';
import { useState } from 'react';
import attachmentModel from '../../../common/models/attachment';
import storage from '../../../common/services/storage';
import errorReports from '../../../common/services/api/errorReports';
import bidsDb from '../../../common/services/firestore/bids';

interface Returned {
  queuedAttachmentForDeletion: attachmentModel;
  queueAttachmentForDelete: (attachment: attachmentModel) => any;
  onConfirmAttachmentDelete: (
    bidId: string,
    attachment: attachmentModel
  ) => any;
  isDeleting: boolean;
}

type userNotifications = (message: string, options?: any) => any;

const PREFIX = 'feature: BidEdit:';

// Query attachment to delete
// and send delete confirmation
/* eslint-disable */
const useDeleteAttachment = (
  fireStore: firebase.firestore.Firestore,
  sendNotification: userNotifications
): Returned => {
  /* eslint-enable */
  const [queuedAttachmentForDeletion, setQueueDeleteAttachment] =
    useState(null);
  const [isDeleting, sestIsDeleting] = useState(false);

  // Set/unset the attachment
  // queued to be deleted
  const queueAttachmentForDelete = (attachment: null | attachmentModel) => {
    setQueueDeleteAttachment(attachment);
  };

  const onConfirmAttachmentDelete = async (
    bidId: string,
    attachment: attachmentModel
  ) => {
    sestIsDeleting(true);

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
      return sestIsDeleting(false);
    }

    try {
      await bidsDb.removeBidAttachment(fireStore, bidId, attachment);
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

    sestIsDeleting(false);
  };
  return {
    queuedAttachmentForDeletion,
    queueAttachmentForDelete,
    onConfirmAttachmentDelete,
    isDeleting
  };
};

export default useDeleteAttachment;
