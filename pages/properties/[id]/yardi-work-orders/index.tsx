import 'firebase/firestore';
import { ReactElement } from 'react';
import { useRouter } from 'next/router';
import { MainLayout } from '../../../../common/MainLayout';
import LoadingHud from '../../../../common/LoadingHud';
import useWorkOrders from '../../../../features/PropertyWorkOrders/hooks/useWorkOrders';
import useNotifications from '../../../../common/hooks/useNotifications'; // eslint-disable-line
import notifications from '../../../../common/services/notifications'; // eslint-disable-line

const Page: React.FC = (): ReactElement => {
  // eslint-disable-next-line
  const sendNotification = notifications.createPublisher(useNotifications());
  const router = useRouter();
  const { id } = router.query;
  const propertyId = typeof id === 'string' ? id : id[0];

  // Fetch the data of work orders
  const { data: workOrders, status: workOrdersStatus } = useWorkOrders(
    sendNotification,
    propertyId
  );

  let isLoaded = false;
  if (workOrdersStatus === 'success') {
    isLoaded = true;
  }
  return (
    <MainLayout>
      {isLoaded ? (
        <>
          {/* temporary loaded data render */}
          <h5> Data Loaded - Work Orders:</h5>
          <ul>
            {workOrders.map((wo) => (
              <li key={wo.id}>{wo.id}</li>
            ))}
          </ul>
        </>
      ) : (
        <LoadingHud />
      )}
    </MainLayout>
  );
};

export default Page;
