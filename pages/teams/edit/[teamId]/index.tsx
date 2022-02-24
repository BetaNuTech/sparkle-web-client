import 'firebase/firestore';
import { FunctionComponent } from 'react';
import { useFirestore, useUser } from 'reactfire';
import Router, { useRouter } from 'next/router';
import useTeam from '../../../../common/hooks/useTeam';
import useNotifications from '../../../../common/hooks/useNotifications'; // eslint-disable-line
import notifications from '../../../../common/services/notifications'; // eslint-disable-line
import { MainLayout } from '../../../../common/MainLayout/index';
import TeamEdit from '../../../../features/TeamEdit';
import LoadingHud from '../../../../common/LoadingHud';
import useFirestoreUser from '../../../../common/hooks/useFirestoreUser';
import {
  canAccessCreateTeam,
  canAccessUpdateTeam
} from '../../../../common/utils/userPermissions';

const Page: FunctionComponent = () => {
  const firestore = useFirestore();
  const { data: authUser } = useUser();
  const router = useRouter();
  /* eslint-disable-next-line */
  const sendNotification = notifications.createPublisher(useNotifications());
  const { teamId } = router.query;
  const { data: user, status: userStatus } = useFirestoreUser(
    firestore,
    authUser.uid || ''
  );
  const id = typeof teamId === 'string' ? teamId : teamId[0];
  const isCreatingTeam = id === 'new';
  // Fetch Team
  const { data: team, status: teamStatus } = useTeam(firestore, id);

  // Redirect if team is not found
  if (teamStatus === 'success' && !isCreatingTeam && !team) {
    sendNotification('Team not found', {
      type: 'error'
    });
    Router.push('/properties/');
  }

  // Reject unpermissioned users
  const canCreateTeam = user ? canAccessCreateTeam(user) : false;
  if (user && !canCreateTeam && isCreatingTeam) {
    sendNotification('Sorry, you do not have permission to create a team', {
      type: 'error'
    });
    Router.push('/properties/');
  }

  const canUpdateTeam = user ? canAccessUpdateTeam(user) : false;
  if (user && !canUpdateTeam && !isCreatingTeam) {
    sendNotification('Sorry, you do not have permission to update teams', {
      type: 'error'
    });
    Router.push('/properties/');
  }

  let isLoaded = false;
  if (userStatus === 'success' && teamStatus === 'success') {
    isLoaded = true;
  }

  return (
    <MainLayout user={user}>
      {isLoaded ? <TeamEdit team={team} /> : <LoadingHud />}
    </MainLayout>
  );
};

export default Page;
