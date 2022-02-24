import 'firebase/firestore';
import { ReactElement } from 'react';
import { useRouter } from 'next/router';
import { useUser, useFirestore } from 'reactfire';
import { MainLayout } from '../../../../common/MainLayout';
import useFirestoreUser from '../../../../common/hooks/useFirestoreUser';
import useProperty from '../../../../common/hooks/useProperty';
import useDeficientItems from '../../../../features/DeficientItems/hooks/useDeficientItems';
import LoadingHud from '../../../../common/LoadingHud';
import useNotifications from '../../../../common/hooks/useNotifications';
import notifications from '../../../../common/services/notifications';
import DeficientItems from '../../../../features/DeficientItems';

const Page: React.FC = (): ReactElement => {
  const firestore = useFirestore();
  // eslint-disable-next-line
  const sendNotification = notifications.createPublisher(useNotifications());

  const { data: authUser } = useUser();
  const router = useRouter();
  const { id } = router.query;
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

  // Fetch the data of deficient items list
  const { data: deficientItems, status: deficientItemsStatus } =
    useDeficientItems(firestore, propertyId);

  let isLoaded = false;
  if (
    propertyStatus === 'success' &&
    userStatus === 'success' &&
    deficientItemsStatus === 'success'
  ) {
    isLoaded = true;
  }

  // Redirect bad request and notify user
  if (propertyStatus === 'success' && Boolean(property.name) === false) {
    sendNotification('Could not load property.', { type: 'error' });
    router.push('/properties');
  }

  return (
    <MainLayout user={user}>
      {isLoaded ? (
        <DeficientItems
          user={user}
          property={property}
          deficientItems={deficientItems}
          sendNotification={sendNotification}
        />
      ) : (
        <LoadingHud />
      )}
    </MainLayout>
  );
};

export default Page;
