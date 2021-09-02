import { useEffect, useState } from 'react';
import templateCategoryDb, {
  templateCategoriesCollectionResult
} from '../services/firestore/templateCategories';

interface useTemplateCategoriesResult
  extends templateCategoriesCollectionResult {
  memo: string;
  handlers: any;
}

// Actions
const handlers = {};

// Hooks for all user's properties based on roll
export default function useTemplateCategories(
  firestore: any // eslint-disable-line
): useTemplateCategoriesResult {
  const [memo, setMemo] = useState('[]');

  // No access payload
  const payload = {
    status: 'loading',
    error: null,
    data: [],
    handlers,
    memo
  };

  // Load all properties for admin & corporate
  const result = templateCategoryDb.findAll(firestore);
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
