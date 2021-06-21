import userModel from '../../../common/models/user';
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
  const isAdmin: boolean = user.admin;
  const isCorporate: boolean = user.corporate;
  // Team leads have access to all the
  // nested properties under their teams hash
  const leadershipTeamProperties: Array<string> = [].concat(
    ...Object.values(user.teams || {})
      .filter((team: any) => typeof team === 'object')
      .map((teamHash: any) => Object.keys(teamHash))
  );
  const hasLeadershipTeams: boolean = leadershipTeamProperties.length > 0;

  // Load all teams for admin & corporate
  if (isAdmin || (isCorporate && !hasLeadershipTeams)) {
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
