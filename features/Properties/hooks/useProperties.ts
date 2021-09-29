import { useEffect, useState } from 'react';
import errorReports from '../../../common/services/api/errorReports';
import userModel from '../../../common/models/user';
import {
  getLevelName,
  getProperties,
  getLeadershipProperties
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
    const isTeamLead = permissionLevel === 'teamLead';
    const teamProperties = isTeamLead
      ? getLeadershipProperties(user.teams)
      : [];

    // Collect all unique property id's from
    // both users leadership teams and property
    // memberships, filter for unique
    const propertyIds = [
      ...teamProperties,
      ...getProperties(user.properties)
    ].filter((id, i, arr) => arr.indexOf(id) === i);

    if (propertyIds.length > 10) {
      propertyIds.splice(10);

      // Log issue and send error report
      // of user's missing properties
      const wrappedErr = Error(
        `${PREFIX} User with ${permissionLevel} cannot load all the properties`
      );
      // eslint-disable-next-line no-console
      console.warn(wrappedErr);
      errorReports.send(wrappedErr); // eslint-disable-line
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
