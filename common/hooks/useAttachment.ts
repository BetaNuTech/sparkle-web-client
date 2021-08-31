import { useEffect, useState } from 'react';
import attachmentModel from '../models/attachments';
import attachmentDb, {
  attachmentResult
} from '../services/firestore/attachments';

interface useAttachmentResult extends attachmentResult {
  memo: string;
  handlers: any;
}

// Actions
const handlers = {};

// Hooks for loading attachment record by attachment id
export default function useAttachmentbRecord(
  firestore: any, // eslint-disable-line
  attachmentId: string
): useAttachmentResult {
  const [memo, setMemo] = useState('{}');

  // No access payload
  const payload = {
    status: 'loading',
    error: null,
    data: {} as attachmentModel,
    handlers,
    memo
  };

  const result = attachmentDb.findRecord(firestore, attachmentId);

  Object.assign(payload, result, { handlers });

  // Notify of updates
  // by updating memo
  /* eslint-disable */
  useEffect(() => {
    /* eslint-enable */
    const updated = JSON.stringify(payload.data);

    if (memo !== updated) {
      setMemo(updated);
    }
  });

  return payload;
}
