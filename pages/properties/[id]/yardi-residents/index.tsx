import 'firebase/firestore';
import { ReactElement } from 'react';
import { useRouter } from 'next/router';
import { MainLayout } from '../../../../common/MainLayout';
import LoadingHud from '../../../../common/LoadingHud';
import useResidents from '../../../../features/PropertyResidents/hooks/useResidents';
import PropertyResidents from '../../../../features/PropertyResidents';
import useNotifications from '../../../../common/hooks/useNotifications'; // eslint-disable-line
import notifications from '../../../../common/services/notifications'; // eslint-disable-line

const Page: React.FC = (): ReactElement => {
  // eslint-disable-next-line
  const sendNotification = notifications.createPublisher(useNotifications());
  const router = useRouter();
  const { id } = router.query;
  const propertyId = typeof id === 'string' ? id : id[0];

  // Fetch the data of residents and occupants
  const { data, status: residentStatus } = useResidents(
    sendNotification,
    propertyId
  );

  let isLoaded = false;
  if (residentStatus === 'success') {
    isLoaded = true;
  }
  return (
    <MainLayout>
      {isLoaded ? (
        <PropertyResidents
          residents={data.residents}
          occupants={data.occupants}
          propertyId={propertyId}
        />
      ) : (
        <LoadingHud />
      )}
    </MainLayout>
  );
};

export default Page;
