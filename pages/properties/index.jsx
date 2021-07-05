import 'firebase/firestore';
import { useUser, useFirestore } from 'reactfire';
import { MainLayout } from '../../common/MainLayout';
import Properties from '../../features/Properties';
import useFirestoreUser from '../../common/hooks/useFirestoreUser';

export default function PropertiesPage() {
  const firestore = useFirestore();
  const { data: authUser } = useUser();
  const { data: user } = useFirestoreUser(
    firestore,
    (authUser && authUser.uid) || ''
  );

  return <MainLayout>{user && <Properties user={user} />}</MainLayout>;
}
