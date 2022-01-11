import 'firebase/firestore';
import { ReactElement } from 'react';
import { useRouter } from 'next/router';
import { useUser, useFirestore } from 'reactfire';
import { MainLayout } from '../../../../../../common/MainLayout';
import useFirestoreUser from '../../../../../../common/hooks/useFirestoreUser';
import useProperty from '../../../../../../common/hooks/useProperty';
import useDeficiency from '../../../../../../common/hooks/useDeficiency';
import LoadingHud from '../../../../../../common/LoadingHud';
import useNotifications from '../../../../../../common/hooks/useNotifications';
import notifications from '../../../../../../common/services/notifications';
import DeficiencyEdit from '../../../../../../features/DeficiencyEdit';

const Page: React.FC = (): ReactElement => {
  const firestore = useFirestore();
  // eslint-disable-next-line
  const sendNotification = notifications.createPublisher(useNotifications());

  const { data: authUser } = useUser();
  const router = useRouter();
  const { id, deficientItemId } = router.query;
  const { data: user, status: userStatus } = useFirestoreUser(
    firestore,
    authUser.uid || ''
  );
  const propertyId = typeof id === 'string' ? id : id[0];

  // Fetch the data of property profile
  const { data: property, status: propertyStatus } = useProperty(
    firestore,
    propertyId
  );

  const deficiencyId =
    typeof deficientItemId === 'string' ? deficientItemId : deficientItemId[0];

  // Fetch the data of deficiency item
  const { data: deficientItem, status: deficientItemStatus } = useDeficiency(
    firestore,
    deficiencyId
  );

  let isLoaded = false;
  if (
    propertyStatus === 'success' &&
    userStatus === 'success' &&
    deficientItemStatus === 'success'
  ) {
    isLoaded = true;
  }

  // Redirect bad request and notify user
  if (propertyStatus === 'success' && Boolean(property.name) === false) {
    sendNotification('Could not load property.', { type: 'error' });
    router.push('/properties');
  }

  // Redirect bad request and notify user
  if (
    deficientItemStatus === 'success' &&
    Boolean(deficientItem.sectionTitle) === false
  ) {
    sendNotification('Could not load deficiency item.', { type: 'error' });
    router.push(`/properties/${propertyId}/deficient-items`);
  }

  return (
    <MainLayout>
      {isLoaded ? (
        <DeficiencyEdit
          user={user}
          property={property}
          deficientItem={deficientItem}
        />
      ) : (
        <LoadingHud />
      )}
    </MainLayout>
  );
};

export default Page;
