import { useEffect, useState } from 'react';
import errorReports from '../../../common/services/api/errorReports';
import userModel from '../../../common/models/user';
import {
  getLevelName,
  getProperties
} from '../../../common/utils/userPermissions';
import propertiesApi, {
  propertiesCollectionResult
} from '../../../common/services/firestore/properties';

const PREFIX = 'features: properties: hooks: useProperties:';
interface usePropertiesResult extends propertiesCollectionResult {
  memo: string;
  handlers: any;
}

// Actions
const handlers = {};

// Hooks for all user's properties based on roll
export default function useProperties(
  firestore: any, // eslint-disable-line
  user: userModel
): usePropertiesResult {
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
    const result = propertiesApi.findAll(firestore);
    Object.assign(payload, result, { handlers });
  } else if (['teamLead', 'propertyMember'].includes(permissionLevel)) {
    // Get the properties of user
    const propertyIds = getProperties(user.properties);

    if (propertyIds.length > 10) {
      propertyIds.splice(10);
      // Check if we have ids more than 10 then we should log it in browser
      // eslint-disable-next-line no-console
      console.warn('Could not load all the properties');
      // Also send error report
      /* eslint-disable */
      errorReports.send(
        /* eslint-enable */
        new Error(
          `${PREFIX} User with ${permissionLevel} cannot load all the properties`
        )
      );
    }

    const result = propertiesApi.queryRecords(firestore, propertyIds);
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
