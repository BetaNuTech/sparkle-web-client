import errorReports from '../../../common/services/api/errorReports';
import userModel from '../../../common/models/user';
import {
  getLevelName,
  getPropertyLevelAccess
} from '../../../common/utils/userPermissions';
import propertiesApi, {
  propertiesCollectionResult
} from '../../../common/services/firestore/properties';

const PREFIX = 'features: properties: hooks: useProperties:';
interface usePropertiesResult extends propertiesCollectionResult {
  handlers: any;
}

// Actions
const handlers = {};

// Hooks for all user's properties based on roll
export default function useProperties(
  firestore: any, // eslint-disable-line
  user?: userModel
): usePropertiesResult {
  const permissionLevel = getLevelName(user);

  // Get the properties of user
  // Collect all unique property id's from
  // both users team property and user property
  // memberships, filter for unique
  const propertyIds = (
    user ? getPropertyLevelAccess(user.properties || {}, user.teams || {}) : []
  ).filter((id, i, arr) => arr.indexOf(id) === i); // unique only
  const hasProperties = propertyIds.length > 0;

  // No access payload
  const payload = {
    status: 'loading',
    error: null,
    data: [],
    handlers
  };

  let result = null;
  // Load all properties for admin & corporate
  if (user.admin || user.corporate) {
    result = propertiesApi.findAll(firestore);
  } else if (user && hasProperties) {
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

    result = propertiesApi.queryRecords(firestore, propertyIds);
  } else {
    // Fix for requiring all hooks to call
    // on every render
    result = propertiesApi.queryRecords(firestore, []);
  }

  Object.assign(payload, result, { handlers });

  return payload;
}
