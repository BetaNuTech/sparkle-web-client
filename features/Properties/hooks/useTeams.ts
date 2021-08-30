import { useEffect, useState } from 'react';
import errorReports from '../../../common/services/api/errorReports';
import userModel from '../../../common/models/user';
import teamsModel from '../../../common/models/team';
import { getLevelName, getTeams } from '../../../common/utils/userPermissions';
import teamsApi, {
  teamsCollectionResult
} from '../../../common/services/firestore/teams';

const PREFIX = 'features: properties: hooks: useTeams:';
interface useTeamsResult extends teamsCollectionResult {
  memo: string;
  handlers: any;
}

// Actions
const handlers = {};

// Hooks for all user's teams based on roll
export default function useTeams(
  firestore: any, // eslint-disable-line
  user?: userModel
): useTeamsResult {
  const [memo, setMemo] = useState('[]');
  // Return all users if no permision
  const permissionLevel = user ? getLevelName(user) : 'admin';

  // No access payload
  const payload = {
    status: 'loading',
    error: null,
    data: [],
    handlers,
    memo
  };

  // Load all teams for admin & corporate
  if (['admin', 'corporate'].includes(permissionLevel)) {
    const result = teamsApi.findAll(firestore);
    Object.assign(payload, result, { handlers });
  } else if (['teamLead', 'propertyMember'].includes(permissionLevel)) {
    const teamIds = getTeams(user.teams);

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

    const result = teamsApi.queryRecords(firestore, teamIds);
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
