import 'firebase/firestore';
import { ReactElement, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useFirestore, useUser } from 'reactfire';
import useProperty from '../../../../common/hooks/useProperty';
import { MainLayout } from '../../../../common/MainLayout';
import LoadingHud from '../../../../common/LoadingHud';
import useNotifications from '../../../../common/hooks/useNotifications'; // eslint-disable-line
import notifications from '../../../../common/services/notifications'; // eslint-disable-line
import useFirestoreUser from '../../../../common/hooks/useFirestoreUser';
import useCustomValues from '../../../../features/PropertyWorkOrders/hooks/useCustomValues';
import useUnitOptions from '../../../../features/PropertyWorkOrders/hooks/useUnitOptions';
import WorkOrderEdit from '../../../../features/PropertyWorkOrders/WorkOrderEdit';
import features from '../../../../config/features';

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

  const { data: property, status: propertyStatus } = useProperty(
    firestore,
    propertyId
  );

  const { data: customValues, status: customValuesStatus } = useCustomValues(
    sendNotification,
    propertyId
  );

  // Units of current residents for the
  // unit picker; the form never waits on it
  const { data: unitOptions, status: unitOptionsStatus } =
    useUnitOptions(propertyId);

  // Creating ships dark
  useEffect(() => {
    if (!features.supportPropertyYardiWorkOrderEdit) {
      router.replace(`/properties/${propertyId}/yardi-work-orders`);
    }
  }, [propertyId]); // eslint-disable-line react-hooks/exhaustive-deps

  const isLoaded =
    userStatus === 'success' &&
    propertyStatus === 'success' &&
    customValuesStatus !== 'loading';

  return (
    <MainLayout user={user}>
      {isLoaded ? (
        <WorkOrderEdit
          property={property}
          customValues={customValues}
          customValuesStatus={customValuesStatus}
          sendNotification={sendNotification}
          unitOptions={unitOptions}
          unitOptionsStatus={unitOptionsStatus}
        />
      ) : (
        <LoadingHud />
      )}
    </MainLayout>
  );
};

export default Page;
