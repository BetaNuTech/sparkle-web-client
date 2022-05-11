import 'firebase/firestore';
import { FunctionComponent, useEffect } from 'react';
import { useFirestore, useUser } from 'reactfire';
import Router, { useRouter } from 'next/router';
import useProperty from '../../../../common/hooks/useProperty';
import useTeams from '../../../../features/Properties/hooks/useTeams';
import useTemplates from '../../../../common/hooks/useTemplates';
import useTemplateCategories from '../../../../common/hooks/useTemplateCategories';
import useNotifications from '../../../../common/hooks/useNotifications'; // eslint-disable-line
import notifications from '../../../../common/services/notifications'; // eslint-disable-line
import { MainLayout } from '../../../../common/MainLayout/index';
import PropertyEdit from '../../../../features/PropertyEdit/index';
import LoadingHud from '../../../../common/LoadingHud';
import useFirestoreUser from '../../../../common/hooks/useFirestoreUser';
import { canCreateProperty } from '../../../../common/utils/userPermissions';
import useTrelloIntegration from '../../../../common/hooks/useTrelloIntegration';

const Page: FunctionComponent = () => {
  const firestore = useFirestore();
  const { data: authUser } = useUser();
  const router = useRouter();
  /* eslint-disable-next-line */
  const sendNotification = notifications.createPublisher(useNotifications());
  const { propertyId } = router.query;
  const { data: user, status: userStatus } = useFirestoreUser(
    firestore,
    authUser.uid || ''
  );
  const id = typeof propertyId === 'string' ? propertyId : propertyId[0];
  const isCreatingProperty = id === 'new';
  const { data, status: propertyStatus } = useProperty(firestore, id);
  // Fetch Teams
  const { data: teams, status: teamsStatus } = useTeams(firestore);
  // Fetch Templates
  const { data: templates, status: templatesStatus } = useTemplates(firestore);
  // Fetch all data in template categories
  const { data: templateCategories, status: tamplateCatStatus } =
    useTemplateCategories(firestore);

  // Load Trello integration
  const { data: trelloIntegration, status: trelloIntegrationStatus } =
    useTrelloIntegration(firestore);

  let property = { name: '' };
  if (!isCreatingProperty) {
    property = data;
  }

  // Reject unpermissioned users
  const canAddProperty = user ? canCreateProperty(user) : false;
  if (user && !canAddProperty && isCreatingProperty) {
    sendNotification('Sorry, you do not have permission to create a property', {
      type: 'error'
    });
    Router.push('/properties/');
  }

  // using this useEffect so it only
  // sends single notification to user
  useEffect(() => {
    // Redirect to properties if property not found with error notification
    if (
      !property?.name &&
      propertyStatus === 'success' &&
      !isCreatingProperty
    ) {
      sendNotification('Property does not exist.', {
        type: 'error'
      });
      Router.push('/properties/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyStatus, property]);

  let isLoaded = false;
  if (
    propertyStatus === 'success' &&
    userStatus === 'success' &&
    teamsStatus === 'success' &&
    templatesStatus === 'success' &&
    tamplateCatStatus === 'success' &&
    trelloIntegrationStatus === 'success'
  ) {
    isLoaded = true;
  }

  return (
    <MainLayout user={user}>
      {isLoaded ? (
        <PropertyEdit
          user={user}
          property={property}
          teams={teams}
          templates={templates}
          templateCategories={templateCategories}
          trelloIntegration={trelloIntegration}
        />
      ) : (
        <LoadingHud />
      )}
    </MainLayout>
  );
};

export default Page;
