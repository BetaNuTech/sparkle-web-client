import 'firebase/firestore';
import { ReactElement, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUser, useFirestore } from 'reactfire';
import { MainLayout } from '../../../../common/MainLayout';
import useFirestoreUser from '../../../../common/hooks/useFirestoreUser';
import useProperties from '../../../../features/Properties/hooks/useProperties';
import useTeams from '../../../../features/Properties/hooks/useTeams';
import LoadingHud from '../../../../common/LoadingHud';
import useNotifications from '../../../../common/hooks/useNotifications';
import notifications from '../../../../common/services/notifications';
import { getLevelName } from '../../../../common/utils/userPermissions';
import UserEdit from '../../../../features/UserEdit';

const Page: React.FC = (): ReactElement => {
  const firestore = useFirestore();
  const router = useRouter();
  const { data: authUser } = useUser();
  const { id } = router.query;
  const userId = typeof id === 'string' ? id : id[0];

  // load current logged-in user
  const { data: user, status: userStatus } = useFirestoreUser(
    firestore,
    (authUser && authUser.uid) || ''
  );
  const loadedUser = userStatus === 'success' && user;
  // load requested user
  const { data: targetUser, status: targetUserStatus } = useFirestoreUser(
    firestore,
    userId
  );
  // eslint-disable-next-line
  const sendNotification = notifications.createPublisher(useNotifications());

  // Load all properties
  const { data: properties, status: propertyStatus } = useProperties(
    firestore,
    loadedUser
  );

  // Load all teams
  const { status: teamsStatus, data: teams } = useTeams(firestore);

  const canEdit =
    getLevelName(loadedUser) === 'admin' || authUser.uid === userId;

  // using this useEffect so it only
  // sends single notification to user
  useEffect(() => {
    // Redirect unauthorized user with error notification
    if (!canEdit && userStatus === 'success') {
      sendNotification('Only admins may manage users.', {
        type: 'error'
      });
      router.push('/properties');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userStatus, canEdit]);

  // using this useEffect so it only
  // sends single notification to user
  useEffect(() => {
    // Redirect to users if user not found with error notification
    if (
      !targetUser?.email &&
      targetUserStatus === 'success' &&
      targetUser.id !== 'new'
    ) {
      sendNotification('User does not exist.', {
        type: 'error'
      });
      router.push('/users');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetUserStatus, targetUser]);

  let isLoaded = false;
  if (
    propertyStatus === 'success' &&
    userStatus === 'success' &&
    targetUserStatus === 'success' &&
    teamsStatus === 'success'
  ) {
    isLoaded = true;
  }

  return (
    <MainLayout user={user}>
      {isLoaded ? (
        <UserEdit
          user={user}
          target={targetUser}
          properties={properties}
          teams={teams}
        />
      ) : (
        <LoadingHud />
      )}
    </MainLayout>
  );
};

export default Page;
