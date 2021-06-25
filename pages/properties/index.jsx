import { useUser } from 'reactfire';
import { MainLayout } from '../../common/MainLayout';
import Properties from '../../features/Properties';
import useFirestoreUser from '../../common/hooks/useFirestoreUser';

export default function PropertiesPage() {
  const { data: authUser } = useUser();
  const { data: user } = useFirestoreUser(authUser.uid || '');

  return <MainLayout>{user && <Properties user={user} />}</MainLayout>;
}
