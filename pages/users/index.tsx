import 'firebase/firestore';
import { ReactElement } from 'react';
import { useUser, useFirestore } from 'reactfire';
import { MainLayout } from '../../common/MainLayout';
import useFirestoreUser from '../../common/hooks/useFirestoreUser';
import LoadingHud from '../../common/LoadingHud';
import Users from '../../features/Users';

const Page: React.FC = (): ReactElement => {
  const firestore = useFirestore();
  const { data: authUser } = useUser();

  // load current logged-in user
  const { data: user, status: userStatus } = useFirestoreUser(
    firestore,
    (authUser && authUser.uid) || ''
  );

  const isLoaded = userStatus === 'success';

  return (
    <MainLayout user={user}>
      {isLoaded ? <Users user={user} /> : <LoadingHud />}
    </MainLayout>
  );
};

export default Page;
