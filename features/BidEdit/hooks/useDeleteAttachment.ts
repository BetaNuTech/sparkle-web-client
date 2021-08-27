import { useState } from 'react';
import bidAttachmentModel from '../../../common/models/bidAttachment';

interface Returned {
  queuedAttachmentForDeletion: bidAttachmentModel;
  queueAttachmentForDelete: (attachment: bidAttachmentModel) => any;
}

// Query inspection to delete
// and send delete confirmation
/* eslint-disable */
const useDeleteAttachment = (): Returned => {
  /* eslint-enable */
  const [queuedAttachmentForDeletion, setQueueDeleteAttachment] =
    useState(null);

  // Set/unset the inspection
  // queued to be deleted
  const queueAttachmentForDelete = (attachment: null | bidAttachmentModel) => {
    setQueueDeleteAttachment(attachment);
  };

  return {
    queuedAttachmentForDeletion,
    queueAttachmentForDelete
  };
};

export default useDeleteAttachment;
