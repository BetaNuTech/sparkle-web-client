import 'firebase/firestore';
import { FunctionComponent, useEffect } from 'react';
import Router, { useRouter } from 'next/router';
import { useUser, useFirestore } from 'reactfire';
import { MainLayout } from '../../../common/MainLayout';
import useTeam from '../../../common/hooks/useTeam';
import useQueryProperties from '../../../common/hooks/useQueryProperties';
import Teams from '../../../features/TeamProfile/index';
import useFirestoreUser from '../../../common/hooks/useFirestoreUser';
import LoadingHud from '../../../common/LoadingHud';
import useNotifications from '../../../common/hooks/useNotifications'; // eslint-disable-line
import notifications from '../../../common/services/notifications'; // eslint-disable-line
import { hasTeamAccess } from '../../../common/utils/userPermissions';

const Page: FunctionComponent = () => {
  const firestore = useFirestore();
  const router = useRouter();
  // User notifications setup
  /* eslint-disable */
  const sendNotification = notifications.createPublisher(useNotifications());
  /* eslint-enable */
  const { data: authUser } = useUser();
  const { data: user, status: userStatus } = useFirestoreUser(
    firestore,
    (authUser && authUser.uid) || ''
  );
  const { teamId } = router.query;

  const id = typeof teamId === 'string' ? teamId : teamId[0];

  const { status: teamStatus, data: team } = useTeam(firestore, id);

  // Collect all team's property relationships
  let teamsProperties = [];
  if (team && team.properties) {
    teamsProperties = Object.keys(team.properties);
  }

  const {
    data: properties,
    status: propertiesStatus,
    memo: propertiesMemo
  } = useQueryProperties(firestore, teamsProperties);

  // Redirect if team is not found
  if (teamStatus === 'success' && !team) {
    sendNotification('Team not found', {
      type: 'error'
    });
    Router.push('/properties/');
  }

  let isLoaded = false;
  if (
    propertiesStatus === 'success' &&
    teamStatus === 'success' &&
    userStatus === 'success'
  ) {
    isLoaded = true;
  }

  // using this useEffect so it only
  // sends single notification to user
  useEffect(() => {
    // Redirect to properties
    // if user dont have access to team
    if (userStatus === 'success' && user && !hasTeamAccess(user, id)) {
      sendNotification('You do not have access to this team', {
        type: 'error'
      });
      Router.push('/properties/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userStatus, user, id]);

  return (
    <MainLayout user={user}>
      {isLoaded ? (
        <Teams
          user={user}
          team={team}
          properties={properties}
          propertiesMemo={propertiesMemo}
        />
      ) : (
        <LoadingHud />
      )}
    </MainLayout>
  );
};

export default Page;
