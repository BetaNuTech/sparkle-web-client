import { useEffect, useState } from 'react';
import templatesDb, { templateResult } from '../services/firestore/templates';
import templateModel from '../models/template';

interface useTemplateResult extends templateResult {
  memo: string;
  handlers: any;
}

// Actions
const handlers = {};

// Hooks for loading template by id
export default function useTemplate(
  firestore: any, // eslint-disable-line
  templateId: string
): useTemplateResult {
  const [memo, setMemo] = useState('{}');

  // No template payload
  const payload = {
    status: 'loading',
    error: null,
    data: {} as templateModel,
    handlers,
    memo
  };

  // Support multi-step request

  const result = templatesDb.findRecord(firestore, templateId);
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
