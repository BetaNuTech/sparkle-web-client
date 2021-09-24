import { useState } from 'react';
import attachmentModel from '../../../common/models/attachment';

interface Returned {
  queuedAttachmentForDeletion: attachmentModel;
  queueAttachmentForDelete: (attachment: attachmentModel) => any;
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
  const queueAttachmentForDelete = (attachment: null | attachmentModel) => {
    setQueueDeleteAttachment(attachment);
  };

  return {
    queuedAttachmentForDeletion,
    queueAttachmentForDelete
  };
};

export default useDeleteAttachment;
