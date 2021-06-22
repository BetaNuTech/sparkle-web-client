import userModel from '../../../common/models/user';
import { getLevelName } from '../../../common/utils/userPermissions';
import propertiesApi, {
  propertiesCollectionResult
} from '../../../common/services/firestore/properties';

interface usePropertiesResult extends propertiesCollectionResult {
  handlers: any;
}

// Actions
const handlers = {};

// Hooks for all user's properties based on roll
export default function useProperties(user: userModel): usePropertiesResult {
  const permissionLevel = getLevelName(user);

  // Load all properties for admin & corporate
  if (['admin', 'corporate'].includes(permissionLevel)) {
    const result = propertiesApi.findAll();
    return { ...result, handlers };
  }

  // No access
  return {
    status: 'loading',
    error: null,
    data: [],
    handlers
  };
}
