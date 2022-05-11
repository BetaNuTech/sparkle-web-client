import errorReports from '../../../common/services/api/errorReports';
import userModel from '../../../common/models/user';
import { getLevelName, getTeams } from '../../../common/utils/userPermissions';
import teamsApi, {
  teamsCollectionResult
} from '../../../common/services/firestore/teams';

const PREFIX = 'features: properties: hooks: useTeams:';
interface Result extends teamsCollectionResult {
  handlers: any;
}

// Actions
const handlers = {};

// Hooks for all user's teams based on roll
export default function useTeams(
  firestore: any, // eslint-disable-line
  user?: userModel
): Result {
  // Return all users if no permision
  const permissionLevel = getLevelName(user);
  const teamIds = user ? getTeams(user.teams || {}) : [];
  const hasTeams = teamIds.length > 0;

  // No access payload
  const payload = {
    status: 'loading',
    error: null,
    data: [],
    handlers
  };

  let result = null;

  // Load all teams for admin & corporate
  if (user && ['admin', 'corporate', 'teamLead'].includes(permissionLevel)) {
    result = teamsApi.findAll(firestore);
  } else if (user && hasTeams) {
    if (teamIds.length > 10) {
      teamIds.splice(10);
      // Log issue and send error report
      // of user's missing teams
      const wrappedErr = Error(
        `${PREFIX} User with ${permissionLevel} cannot load all the teams`
      );
      // eslint-disable-next-line no-console
      console.warn(wrappedErr);
      errorReports.send(wrappedErr); // eslint-disable-line
    }

    result = teamsApi.queryRecords(firestore, teamIds);
    Object.assign(payload, result, { handlers });
  } else {
    // Fix for requiring all hooks to call
    // on every render
    result = teamsApi.queryRecords(firestore, []);
  }

  Object.assign(payload, result, { handlers });

  return payload;
}
