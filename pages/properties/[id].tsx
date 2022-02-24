import 'firebase/firestore';
import { ReactElement } from 'react';
import { useRouter } from 'next/router';
import { useUser, useFirestore } from 'reactfire';
import { MainLayout } from '../../common/MainLayout';
import PropertyProfile from '../../features/PropertyProfile';
import useFirestoreUser from '../../common/hooks/useFirestoreUser';
import useProperty from '../../common/hooks/useProperty';
import usePropertyInspections from '../../features/PropertyProfile/hooks/usePropertyInspections';
import useYardiIntegration from '../../features/PropertyProfile/hooks/useYardiIntegration';
import useTemplateCategories from '../../common/hooks/useTemplateCategories';
import LoadingHud from '../../common/LoadingHud';

const Page: React.FC = (): ReactElement => {
  const firestore = useFirestore();
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

  // Fetch all data in template categories
  const { data: templateCategories, status: templateCategoriesStatus } =
    useTemplateCategories(firestore);

  // Query property inspection records
  const { data: inspections, status: inspectionsStatus } =
    usePropertyInspections(firestore, propertyId);

  // Query property inspection records
  const { data: yardiAuthorizer } = useYardiIntegration(firestore);

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
