import { MainLayout } from '../../common/MainLayout';
import DeleteConfirmModal from '../../common/DeleteConfirmModal';
import { Properties } from '../../features/Properties';

export default function PropertiesPage() {
  return (
    <MainLayout>
      <Properties />
      <DeleteConfirmModal
        title="Are you sure you want to delete this property?"
        message="You must have admin access in order to update system settings."
      />
    </MainLayout>
  );
}
