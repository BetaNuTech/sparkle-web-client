import { useEffect, useState } from 'react';
import userModel from '../../../common/models/user';
import { getLevelName } from '../../../common/utils/userPermissions';
import propertiesApi, {
  propertiesCollectionResult
} from '../../../common/services/firestore/properties';

interface usePropertiesResult extends propertiesCollectionResult {
  memo: string;
  handlers: any;
}

// Actions
const handlers = {};

// Hooks for all user's properties based on roll
export default function useProperties(user: userModel): usePropertiesResult {
  const [memo, setMemo] = useState('[]');
  const permissionLevel = getLevelName(user);

  // No access payload
  const payload = {
    status: 'loading',
    error: null,
    data: [],
    handlers,
    memo
  };

  // Load all properties for admin & corporate
  if (['admin', 'corporate'].includes(permissionLevel)) {
    const result = propertiesApi.findAll();
    Object.assign(payload, result, { handlers });
  }

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
