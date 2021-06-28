import { useState } from 'react';
import teamsApi from '../../../common/services/firestore/teams';
import teamModel from '../../../common/models/team';
import errorReports from '../../../common/services/api/errorReports';

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
const useDeleteTeam = (
  firestore: any,
  sendNotification: userNotifications
): Returned => {
  /* eslint-enable */
  const [queuedTeamForDeletion, setQueueDeleteTeam] = useState(null);

  // Set/unset the team
  // queued to be deleted
  const queueTeamForDelete = (team: null | teamModel) => {
    setQueueDeleteTeam(team);
  };

  // Request to delete the queued team
  const confirmTeamDelete = async (): Promise<any> => {
    try {
      await teamsApi.deleteRecord(firestore, queuedTeamForDeletion.id);
    } catch (err) {
      // Handle error
      const wrappedErr = Error(`${PREFIX} confirmTeamDelete: ${err}`);
      sendNotification(
        `Failed to delete team: ${
          queuedTeamForDeletion ? queuedTeamForDeletion.name : 'Unknown'
        }`,
        { appearance: 'error' }
      );
      errorReports.send(wrappedErr); // eslint-disable-line
      return wrappedErr;
    }

    // Send success
    sendNotification('Team deleted successfully.', {
      appearance: 'success'
    });
  };

  return {
    queuedTeamForDeletion,
    queueTeamForDelete,
    confirmTeamDelete
  };
};

export default useDeleteTeam;
