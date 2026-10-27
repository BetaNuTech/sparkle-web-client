import 'firebase/firestore';
import { ReactElement } from 'react';
import { useRouter } from 'next/router';
import { useFirestore, useUser } from 'reactfire';
import useProperty from '../../../../common/hooks/useProperty';
import { MainLayout } from '../../../../common/MainLayout';
import LoadingHud from '../../../../common/LoadingHud';
import useNotifications from '../../../../common/hooks/useNotifications'; // eslint-disable-line
import notifications from '../../../../common/services/notifications'; // eslint-disable-line
import useFirestoreUser from '../../../../common/hooks/useFirestoreUser';
import useWorkOrder from '../../../../features/PropertyWorkOrders/hooks/useWorkOrder';
import useCustomValues from '../../../../features/PropertyWorkOrders/hooks/useCustomValues';
import WorkOrderEdit from '../../../../features/PropertyWorkOrders/WorkOrderEdit';

const Page: React.FC = (): ReactElement => {
  const firestore = useFirestore();

  // eslint-disable-next-line
  const sendNotification = notifications.createPublisher(useNotifications());
  const { data: authUser } = useUser();
  const router = useRouter();
  const { id, workOrderId } = router.query;
  const propertyId = typeof id === 'string' ? id : id[0];
  const workOrderIdParam =
    typeof workOrderId === 'string' ? workOrderId : workOrderId[0];

  const { data: user, status: userStatus } = useFirestoreUser(
    firestore,
    authUser.uid || ''
  );

  const { data: property, status: propertyStatus } = useProperty(
    firestore,
    propertyId
  );

  const {
    data: workOrder,
    status: workOrderStatus,
    setData: setWorkOrder
  } = useWorkOrder(sendNotification, propertyId, workOrderIdParam);

  const { data: customValues, status: customValuesStatus } = useCustomValues(
    sendNotification,
    propertyId
  );

  const isLoaded =
    userStatus === 'success' &&
    propertyStatus === 'success' &&
    workOrderStatus === 'success' &&
    customValuesStatus !== 'loading';

  return (
    <MainLayout user={user}>
      {isLoaded ? (
        <WorkOrderEdit
          property={property}
          workOrder={workOrder}
          customValues={customValues}
          customValuesStatus={customValuesStatus}
          sendNotification={sendNotification}
          onWorkOrderUpdated={setWorkOrder}
        />
      ) : (
        <LoadingHud />
      )}
    </MainLayout>
  );
};

export default Page;
