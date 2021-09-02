import 'firebase/firestore';
import { ReactElement } from 'react';
import { useRouter } from 'next/router';
import { useUser, useFirestore } from 'reactfire';
import useProperty from '../../../../../common/hooks/useProperty';
import useInspection from '../../../../../common/hooks/useInspection';
import useTemplate from '../../../../../common/hooks/useTemplate';
import useQueryProperties from '../../../../../common/hooks/useQueryProperties';
import useTeams from '../../../../../features/Properties/hooks/useTeams';
import ReasignInspection from '../../../../../features/PropertyProfile/ReasignInspection';
import { MainLayout } from '../../../../../common/MainLayout';
import useFirestoreUser from '../../../../../common/hooks/useFirestoreUser';
import LoadingHud from '../../../../../common/LoadingHud';
import useNotifications from '../../../../../common/hooks/useNotifications'; // eslint-disable-line
import notifications from '../../../../../common/services/notifications'; // eslint-disable-line

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

  // Fetch Teams
  const { data: teams, status: teamsStatus } = useTeams(firestore);

  // Fetch inspection
  const inspectionIdFinal =
    typeof inspectionId === 'string' ? inspectionId : inspectionId[0];
  const { data: inspection, status: inspectionStatus } = useInspection(
    firestore,
    inspectionIdFinal
  );

  const templateId = inspection && inspection.templateId;

  // Fetch template related to an inspection
  const { data: template, status: templateStatus } = useTemplate(
    firestore,
    templateId
  );

  const propertiesIds = (
    template && template.properties ? template.properties : []
  )
    // eslint-disable-next-line
    .filter((id: string) => id !== propertyId); // remove current property
  const hasAssignableProperties = Boolean(propertiesIds.length);

  // Fetch properties related to template
  const { data: properties, status: propertiesStatus } = useQueryProperties(
    firestore,
    propertiesIds
  );

  // Loading State
  let isLoaded = false;
  if (
    userStatus === 'success' &&
    propertyStatus === 'success' &&
    inspectionStatus === 'success' &&
    templateStatus === 'success' &&
    propertiesStatus === 'success' &&
    teamsStatus === 'success'
  ) {
    isLoaded = true;
  }

  // Redirect back to property profile
  // when inspection is not assignable
  // to another property
  if (templateStatus === 'success' && !hasAssignableProperties) {
    sendNotification(
      'Could not find any properties compatible with this inspection',
      { type: 'error' }
    );
    router.push(`/properties/${propertyId}`);
  }

  return (
    <MainLayout>
      {isLoaded && hasAssignableProperties ? (
        <ReasignInspection
          user={user}
          property={property}
          properties={properties}
          inspection={inspection}
          teams={teams}
        />
      ) : (
        <LoadingHud />
      )}
    </MainLayout>
  );
};

export default Page;
