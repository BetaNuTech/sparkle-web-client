import 'firebase/firestore';
import { ReactElement } from 'react';
import { useRouter } from 'next/router';
import { useFirestore, useUser } from 'reactfire';
import useProperty from '../../../../common/hooks/useProperty';
import { MainLayout } from '../../../../common/MainLayout';
import LoadingHud from '../../../../common/LoadingHud';
import useWorkOrders from '../../../../features/PropertyWorkOrders/hooks/useWorkOrders';
import PropertyWorkOrders from '../../../../features/PropertyWorkOrders';
import useNotifications from '../../../../common/hooks/useNotifications'; // eslint-disable-line
import notifications from '../../../../common/services/notifications'; // eslint-disable-line
import useFirestoreUser from '../../../../common/hooks/useFirestoreUser';

const Page: React.FC = (): ReactElement => {
  const firestore = useFirestore();

  // eslint-disable-next-line
  const sendNotification = notifications.createPublisher(useNotifications());
  const { data: authUser } = useUser();
  const router = useRouter();
  const { id } = router.query;
  const propertyId = typeof id === 'string' ? id : id[0];

  const { data: user, status: userStatus } = useFirestoreUser(
    firestore,
    authUser.uid || ''
  );

  // Fetch the data of work orders
  const { data: workOrders, status: workOrdersStatus } = useWorkOrders(
    sendNotification,
    propertyId
  );

  const { data: property, status: propertyStatus } = useProperty(
    firestore,
    propertyId
  );

  let isLoaded = false;
  if (
    userStatus === 'success' &&
    workOrdersStatus === 'success' &&
    propertyStatus === 'success'
  ) {
    isLoaded = true;
  }
  return (
    <MainLayout user={user}>
      {isLoaded ? (
        <PropertyWorkOrders property={property} workOrders={workOrders} />
      ) : (
        <LoadingHud />
      )}
    </MainLayout>
  );
};

export default Page;
