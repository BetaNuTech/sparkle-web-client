import 'firebase/firestore';
import { ReactElement } from 'react';
import { useRouter } from 'next/router';
import { useUser, useFirestore } from 'reactfire';
import useProperty from '../../../../../common/hooks/useProperty';
import useInspection from '../../../../../common/hooks/useInspection';
import PropertyUpdateInspection from '../../../../../features/PropertyUpdateInspection';
import { MainLayout } from '../../../../../common/MainLayout';
import useFirestoreUser from '../../../../../common/hooks/useFirestoreUser';
import LoadingHud from '../../../../../common/LoadingHud';
import useNotifications from '../../../../../common/hooks/useNotifications';
import notifications from '../../../../../common/services/notifications';
// eslint-disable-next-line max-len
import useUnpublishedTemplateUpdates from '../../../../../features/PropertyUpdateInspection/hooks/useUnpublishedTemplateUpdates';

const Page: React.FC = (): ReactElement => {
  const firestore = useFirestore();
  // eslint-disable-next-line
  const sendNotification = notifications.createPublisher(useNotifications());
  // Fetch User
  const { data: authUser } = useUser();
  const router = useRouter();
  const { data: user, status: userStatus } = useFirestoreUser(
    firestore,
    authUser.uid || ''
  );
  const { inspectionId, id } = router.query;

  // Fetch property
  const propertyId = typeof id === 'string' ? id : id[0];
  const { data: property, status: propertyStatus } = useProperty(
    firestore,
    propertyId
  );

  // Fetch inspection
  const inspectionIdFinal =
    typeof inspectionId === 'string' ? inspectionId : inspectionId[0];
  const { data: inspection, status: inspectionStatus } = useInspection(
    firestore,
    inspectionIdFinal
  );

  // Locally stored user updates to inspection
  // NOTE: users can only update an inspection's template
  const {
    data: updatedTemplate,
    status: updatedTemplateStatus
  } = useUnpublishedTemplateUpdates(
    inspectionIdFinal,
    propertyId,
    sendNotification
  );

  // Loading State
  let isLoaded = false;
  if (
    userStatus === 'success' &&
    propertyStatus === 'success' &&
    inspectionStatus === 'success' &&
    updatedTemplateStatus === 'success'
  ) {
    isLoaded = true;
  }

  let isRedirectRequired = false;
  let redirectUrl = '';
  let notificationMsg = '';
  const isPropertyNotFound =
    propertyStatus === 'success' && Boolean(property.name) === false;
  const isInspectionNotFound =
    inspectionStatus === 'success' && Boolean(inspection.id) === false;
  const isInspectioNotPropertys =
    inspectionStatus === 'success' && inspection.property !== propertyId;

  // Property not found
  if (isPropertyNotFound) {
    isRedirectRequired = true;
    redirectUrl = '/properties';
    notificationMsg = 'Could not load property.';

    // Inspection not found
  } else if (isInspectionNotFound) {
    isRedirectRequired = true;
    redirectUrl = `/properties/${propertyId}`;
    notificationMsg = 'Could not load inspection.';

    // Inspection is not associated to the property
  } else if (isInspectioNotPropertys) {
    isRedirectRequired = true;
    redirectUrl = `/properties/${propertyId}`;
    notificationMsg = 'Inspection does not belong this property.';
  }

  // Redirect bad request and notify user
  if (isRedirectRequired) {
    sendNotification(notificationMsg, { type: 'error' });
    router.push(redirectUrl);
  }

  return (
    <MainLayout>
      {isLoaded ? (
        <PropertyUpdateInspection
          user={user}
          property={property}
          inspection={inspection}
          unpublishedTemplateUpdates={updatedTemplate}
        />
      ) : (
        <LoadingHud />
      )}
    </MainLayout>
  );
};

export default Page;
