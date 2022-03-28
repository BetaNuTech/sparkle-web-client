import 'firebase/firestore';
import { ReactElement } from 'react';
import { useRouter } from 'next/router';
import { useFirestore } from 'reactfire';
import useProperty from '../../../../common/hooks/useProperty';
import { MainLayout } from '../../../../common/MainLayout';
import LoadingHud from '../../../../common/LoadingHud';
import useResidents from '../../../../features/PropertyResidents/hooks/useResidents';
import PropertyResidents from '../../../../features/PropertyResidents';
import useNotifications from '../../../../common/hooks/useNotifications'; // eslint-disable-line
import notifications from '../../../../common/services/notifications'; // eslint-disable-line

const Page: React.FC = (): ReactElement => {
  const firestore = useFirestore();

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

  // Fetch the data of property
  const { data: property, status: propertyStatus } = useProperty(
    firestore,
    propertyId
  );

  let isLoaded = false;
  if (residentStatus === 'success' && propertyStatus === 'success') {
    isLoaded = true;
  }
  return (
    <MainLayout>
      {isLoaded ? (
        <PropertyResidents
          residents={data.residents}
          occupants={data.occupants}
          property={property}
        />
      ) : (
        <LoadingHud />
      )}
    </MainLayout>
  );
};

export default Page;
