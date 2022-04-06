import 'firebase/firestore';
import { ReactElement, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUser, useFirestore } from 'reactfire';
import { MainLayout } from '../../common/MainLayout';
import PropertyProfile from '../../features/PropertyProfile';
import useFirestoreUser from '../../common/hooks/useFirestoreUser';
import useNotifications from '../../common/hooks/useNotifications'; // eslint-disable-line
import notifications from '../../common/services/notifications'; // eslint-disable-line
import useProperty from '../../common/hooks/useProperty';
import usePropertyInspections from '../../features/PropertyProfile/hooks/usePropertyInspections';
import useYardiIntegration from '../../features/PropertyProfile/hooks/useYardiIntegration';
import useTemplateCategories from '../../common/hooks/useTemplateCategories';
import LoadingHud from '../../common/LoadingHud';

const Page: React.FC = (): ReactElement => {
  const firestore = useFirestore();
  const { data: authUser } = useUser();
  const router = useRouter();

  /* eslint-disable-next-line */
  const sendNotification = notifications.createPublisher(useNotifications());

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

  // Fetch all data in template categories
  const { data: templateCategories, status: templateCategoriesStatus } =
    useTemplateCategories(firestore);

  // Query property inspection records
  const { data: inspections, status: inspectionsStatus } =
    usePropertyInspections(firestore, propertyId);

  // Query property inspection records
  const { data: yardiAuthorizer } = useYardiIntegration(firestore);

  // using this useEffect so it only
  // sends single notification to user
  useEffect(() => {
    // Redirect to properties if property not found with error notification
    if (!property?.name && propertyStatus === 'success') {
      sendNotification('Property does not exist.', {
        type: 'error'
      });
      router.push('/properties/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyStatus, property]);

  let isLoaded = false;
  if (
    propertyStatus === 'success' &&
    userStatus === 'success' &&
    templateCategoriesStatus === 'success' &&
    inspectionsStatus === 'success'
  ) {
    isLoaded = true;
  }
  return (
    <MainLayout user={user}>
      {isLoaded ? (
        <PropertyProfile
          user={user}
          id={propertyId}
          property={property}
          templateCategories={templateCategories}
          inspections={inspections}
          yardiAuthorizer={yardiAuthorizer}
        />
      ) : (
        <LoadingHud />
      )}
    </MainLayout>
  );
};

export default Page;
