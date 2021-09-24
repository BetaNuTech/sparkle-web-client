import firebase from 'firebase/app';
import { useState } from 'react';
import moment from 'moment';
import useStorage, { StorageResult } from '../../../common/hooks/useStorage';
import errorReports from '../../../common/services/api/errorReports';
import attachmentModel from '../../../common/models/attachment';
import jobDb from '../../../common/services/firestore/jobs';

const PREFIX = 'features: EditJob: hooks: useAttachmentChange:';

export interface JobApiResult {
  isLoading: boolean;
  statusCode: number;
  response: any;
}

type userNotifications = (message: string, options?: any) => any;

export type FileChangeEvent = {
  target: {
    files: File[];
  };
};

interface useAttachmentResult {
  uploadState: boolean;
  onFileChange(ev: FileChangeEvent): void;
}

export default function useAttachment(
  firestore: firebase.firestore.Firestore,
  propertyId: string,
  jobId: string,
  sendNotification: userNotifications
): useAttachmentResult {
  const [uploadState, setUploadState] = useState(false);
  useState<attachmentModel>(null);
  const { uploadFileToStorage } = useStorage();

  const onFileChange = async (ev: FileChangeEvent) => {
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

    const attachment: attachmentModel = {
      name: file.name,
      size: file.size,
      type: file.type,
      createdAt: moment().unix(),
      storageRef: result.fileDestination,
      url: result.fileUrl
    };

    // Update attachment to job
    try {
      await jobDb.addSOWAttachment(firestore, jobId, attachment);
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

  return {
    uploadState,
    onFileChange
  };
}
