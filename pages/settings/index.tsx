import 'firebase/firestore';
import { ReactElement, useEffect, useMemo } from 'react';
import { useUser, useFirestore } from 'reactfire';
import { useRouter } from 'next/router';
import { MainLayout } from '../../common/MainLayout';
import useFirestoreUser from '../../common/hooks/useFirestoreUser';
import useNotifications from '../../common/hooks/useNotifications';
import notifications from '../../common/services/notifications';
import LoadingHud from '../../common/LoadingHud';
import { canUpdateSystemSettings } from '../../common/utils/userPermissions';
import useTrelloIntegration from '../../common/hooks/useTrelloIntegration';
import useSlackIntegration from '../../common/hooks/useSlackIntegration';
import Settings from '../../features/Settings';

const Page: React.FC = (): ReactElement => {
  const firestore = useFirestore();

  // eslint-disable-next-line
  const sendNotification = notifications.createPublisher(useNotifications());
  const router = useRouter();
  const { data: authUser } = useUser();

  // load current logged-in user
  const { data: user, status: userStatus } = useFirestoreUser(
    firestore,
    (authUser && authUser.uid) || ''
  );

  // Load Trello integration
  const { data: trello, status: trelloStatus } =
    useTrelloIntegration(firestore);

  // Load Slack integration
  const { data: slack, status: slackStatus } = useSlackIntegration(firestore);

  const canUpdate = useMemo(
    () => userStatus === 'success' && canUpdateSystemSettings(user),
    [userStatus, user]
  );

  // using this useEffect so it only
  // sends single notification to user
  useEffect(() => {
    // Redirect unauthorized user with error notification
    if (!canUpdate && userStatus === 'success') {
      sendNotification('You do not have permission to view this page', {
        type: 'error'
      });
      router.push('/properties');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userStatus, canUpdate]);

  const isLoaded =
    userStatus === 'success' &&
    trelloStatus === 'success' &&
    slackStatus === 'success';

  return (
    <MainLayout user={user}>
      {isLoaded ? <Settings trello={trello} slack={slack} /> : <LoadingHud />}
    </MainLayout>
  );
};

export default Page;