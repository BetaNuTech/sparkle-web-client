import { useState } from 'react';
import teamsApi from '../../../common/services/api/teams';
import teamModel from '../../../common/models/team';
import errorReports from '../../../common/services/api/errorReports';
import ErrorForbidden from '../../../common/models/errors/forbidden';
import ErrorNotFound from '../../../common/models/errors/notFound';

const PREFIX = 'features: properties: hooks: useDeleteTeam:';
interface Returned {
  queuedTeamForDeletion: teamModel | null;
  queueTeamForDelete: (team: teamModel) => any;
  confirmTeamDelete: () => Promise<any>;
}
type userNotifications = (message: string, options?: any) => any;

// Query team to delete
// and send delete confirmation
/* eslint-disable */
const useDeleteTeam = (sendNotification: userNotifications): Returned => {
  /* eslint-enable */
  const [queuedTeamForDeletion, setQueueDeleteTeam] = useState(null);

  const handleSuccessResponse = () => {
    // Show success notification for deleting a team
    sendNotification('Team deleted successfully.', {
      type: 'success'
    });
  };

  const handleErrorResponse = (apiError: Error) => {
    if (apiError instanceof ErrorForbidden) {
      // User not allowed to delete team
      sendNotification('You are not allowed to delete this team.', {
        type: 'error'
      });
    } else if (apiError instanceof ErrorNotFound) {
      // Team not found or already deleted
      sendNotification(
        'Team to delete could not be found. Please ensure team exists.',
        {
          type: 'error'
        }
      );
    } else {
      // User not allowed to deletee team
      sendNotification('Please try again, or contact an admin.', {
        type: 'error'
      });
      // Log issue and send error report
      // of user's missing properties
      // eslint-disable-next-line no-case-declarations
      const wrappedErr = Error(
        `${PREFIX} Could not complete team create/update operation`
      );
      // eslint-disable-next-line import/no-named-as-default-member
      errorReports.send(wrappedErr);
    }
  };

  // Set/unset the team
  // queued to be deleted
  const queueTeamForDelete = (team: null | teamModel) => {
    setQueueDeleteTeam(team);
  };

  // Request to delete the queued team
  const confirmTeamDelete = () =>
    /* eslint-disable import/no-named-as-default-member */
    teamsApi
      .deleteTeam(queuedTeamForDeletion.id)
      .then(handleSuccessResponse)
      .catch((err) => {
        handleErrorResponse(err);
      });

  return {
    queuedTeamForDeletion,
    queueTeamForDelete,
    confirmTeamDelete
  };
};

export default useDeleteTeam;
