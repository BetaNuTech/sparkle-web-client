import { useUser } from 'reactfire';
import { MainLayout } from '../../common/MainLayout';
import DeleteConfirmModal from '../../common/DeleteConfirmModal';
import Properties from '../../features/Properties';
import useFirestoreUser from '../../common/hooks/useFirestoreUser';

export default function PropertiesPage() {
  const { data: authUser } = useUser();
  const { data: user } = useFirestoreUser(authUser.uid || '');

  return (
    <MainLayout>
      {user && <Properties user={user} />}
      <DeleteConfirmModal
        title="Are you sure you want to delete this property?"
        message="You must have admin access in order to update system settings."
      />
    </MainLayout>
  );
}
