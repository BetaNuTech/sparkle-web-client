import 'firebase/firestore';
import { FunctionComponent } from 'react';
import { useFirestore, useUser } from 'reactfire';
import { useRouter } from 'next/router';
import useProperty from '../../../../common/hooks/useProperty';
import useTeams from '../../../../features/Properties/hooks/useTeams';
import useTemplates from '../../../../common/hooks/useTemplates';
import useTemplateCategories from '../../../../common/hooks/useTemplateCategories';
import { MainLayout } from '../../../../common/MainLayout/index';
import PropertyEdit from '../../../../features/PropertyEdit/index';
import LoadingHud from '../../../../common/LoadingHud';
import useFirestoreUser from '../../../../common/hooks/useFirestoreUser';

const Page: FunctionComponent = () => {
  const firestore = useFirestore();
  const { data: authUser } = useUser();
  const router = useRouter();
  const { propertyId } = router.query;
  const { data: user } = useFirestoreUser(firestore, authUser.uid || '');
  const id = typeof propertyId === 'string' ? propertyId : propertyId[0];
  let property = {};
  const { data, status: propertyStatus } = useProperty(firestore, id);
  // Fetch Teams
  const { data: teams, status: teamsStatus } = useTeams(firestore);
  // Fetch Templates
  const { data: templates, status: templatesStatus } = useTemplates(firestore);
  // Fetch all data in template categories
  const { data: templateCategories, status: tamplateCatStatus } =
    useTemplateCategories(firestore);
  if (id !== 'new') {
    property = data;
  }

  let isLoaded = false;
  if (
    propertyStatus === 'success' &&
    teamsStatus === 'success' &&
    templatesStatus === 'success' &&
    tamplateCatStatus === 'success'
  ) {
    isLoaded = true;
  }

  return (
    <MainLayout>
      {isLoaded ? (
        <PropertyEdit
          user={user}
          property={property}
          teams={teams}
          templates={templates}
          templateCategories={templateCategories}
        />
      ) : (
        <LoadingHud />
      )}
    </MainLayout>
  );
};

export default Page;
