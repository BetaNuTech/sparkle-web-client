import 'firebase/firestore';
import { ReactElement, useEffect, useMemo } from 'react';
import { useUser, useFirestore } from 'reactfire';
import { useRouter } from 'next/router';
import { MainLayout } from '../../common/MainLayout';
import useFirestoreUser from '../../common/hooks/useFirestoreUser';
import useNotifications from '../../common/hooks/useNotifications';
import notifications from '../../common/services/notifications';
import LoadingHud from '../../common/LoadingHud';
import Users from '../../features/Users';
import useUsers from '../../features/Users/hooks/useUsers';
import { canViewUsers } from '../../common/utils/userPermissions';

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

  // load all users
  const { data: usersList, status: usersListStatus } = useUsers(firestore);

  const canView = useMemo(
    () => userStatus === 'success' && canViewUsers(user),
    [userStatus, user]
  );

  // using this useEffect so it only
  // sends single notification to user
  useEffect(() => {
    // Redirect unauthorized user with error notification
    if (!canView && userStatus === 'success') {
      sendNotification('Only admins can manage users', {
        type: 'error'
      });
      router.push('/properties');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userStatus, canView]);

  const isLoaded = userStatus === 'success' && usersListStatus === 'success';

  return (
    <MainLayout user={user}>
      {isLoaded ? <Users user={user} list={usersList} /> : <LoadingHud />}
    </MainLayout>
  );
};

export default Page;
