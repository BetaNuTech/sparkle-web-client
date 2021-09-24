import firebase from 'firebase/app';
import { useState } from 'react';
import errorReports from '../../../common/services/api/errorReports';
import attachmentModel from '../../../common/models/attachment';
import jobDb from '../../../common/services/firestore/jobs';
import storage from '../../../common/services/storage';

const PREFIX = 'features: EditJob: hooks: useAttachmentDelete:';

export interface JobApiResult {
  isLoading: boolean;
  statusCode: number;
  response: any;
}

type userNotifications = (message: string, options?: any) => any;

interface useAttachmentDeleteResult {
  isDeleteAttachmentPromptVisible: boolean;
  deleteAtachmentLoading: boolean;
  currentAttachment: attachmentModel;
  onDeleteAttachment(attachment: attachmentModel): void;
  onConfirmAttachmentDelete(): Promise<any>;
  setDeleteAttachmentPromptVisible(newState: boolean): void;
}

export default function useAttachmentDelete(
  firestore: firebase.firestore.Firestore,
  jobId: string,
  sendNotification: userNotifications
): useAttachmentDeleteResult {
  const [isDeleteAttachmentPromptVisible, setDeleteAttachmentPromptVisible] =
    useState(false);
  const [currentAttachment, setCurrentAttachment] =
    useState<attachmentModel>(null);
  const [deleteAtachmentLoading, setDeleteAtachmentLoading] = useState(false);

  const onDeleteAttachment = (attachment: attachmentModel) => {
    setCurrentAttachment(attachment);
    setDeleteAttachmentPromptVisible(true);
  };

  const onConfirmAttachmentDelete = async () => {
    setDeleteAtachmentLoading(true);

    try {
      await storage.deleteFile(currentAttachment.storageRef);
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
      await jobDb.removeSOWAttachment(firestore, jobId, currentAttachment);
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

  return {
    isDeleteAttachmentPromptVisible,
    currentAttachment,
    deleteAtachmentLoading,
    onDeleteAttachment,
    onConfirmAttachmentDelete,
    setDeleteAttachmentPromptVisible
  };
}
