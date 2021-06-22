import userModel from '../../../common/models/user';
import { getLevelName } from '../../../common/utils/userPermissions';
import teamsApi, {
  teamsCollectionResult
} from '../../../common/services/firestore/teams';

interface useTeamsResult extends teamsCollectionResult {
  handlers: any;
}

// Actions
const handlers = {};

// Hooks for all user's teams based on roll
export default function useTeams(user: userModel): useTeamsResult {
  const permissionLevel = getLevelName(user);

  // Load all teams for admin & corporate
  if (['admin', 'corporate'].includes(permissionLevel)) {
    const result = teamsApi.findAll();
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
