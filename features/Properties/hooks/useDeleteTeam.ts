import { useState } from 'react';
import teamsApi from '../../../common/services/firestore/teams';
import teamModel from '../../../common/models/team';
import errorReports from '../../../common/services/api/errorReports';
import globalNotification from '../../../common/services/firestore/notifications';
import userModel from '../../../common/models/user';
import { getUserFullname } from '../../../common/utils/user';

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
  sendNotification: userNotifications,
  user: userModel
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

    const name = queuedTeamForDeletion.name || 'Unknown';
    const authorName = getUserFullname(user);
    const authorEmail = user.email;

    // Send global notification for team delete
    // eslint-disable-next-line import/no-named-as-default-member
    globalNotification.send(firestore, {
      creator: user.id,
      title: 'Team Deletion',
      // eslint-disable-next-line import/no-named-as-default-member
      summary: globalNotification.compileTemplate('team-delete-summary', {
        name,
        authorName
      }),
      // eslint-disable-next-line import/no-named-as-default-member
      markdownBody: globalNotification.compileTemplate(
        'team-delete-markdown-body',
        {
          name,
          authorName,
          authorEmail
        }
      )
    });

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
