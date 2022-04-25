import 'firebase/firestore';
import { FunctionComponent } from 'react';
import { useFirestore, useUser } from 'reactfire';
import Router, { useRouter } from 'next/router';
import useNotifications from '../../../../../common/hooks/useNotifications'; // eslint-disable-line
import notifications from '../../../../../common/services/notifications';
import useProperty from '../../../../../common/hooks/useProperty';
import propertyModel from '../../../../../common/models/property';
import useTrelloBoards from '../../../../../features/PropertyEditTrello/hooks/useTrelloBoards';
import useTrelloIntegration from '../../../../../common/hooks/useTrelloIntegration';
import useTrelloProperty from '../../../../../common/hooks/useTrelloProperty';
import { canUpdateCompanySettings } from '../../../../../common/utils/userPermissions';
import { MainLayout } from '../../../../../common/MainLayout/index';
import PropertyEditTrello from '../../../../../features/PropertyEditTrello/index';
import LoadingHud from '../../../../../common/LoadingHud';
import useFirestoreUser from '../../../../../common/hooks/useFirestoreUser';

const Page: FunctionComponent = () => {
  const firestore = useFirestore();
  const { data: authUser } = useUser();
  /* eslint-disable-next-line */
  const sendNotification = notifications.createPublisher(useNotifications());
  const router = useRouter();

  const { propertyId } = router.query;
  const { status: userStatus, data: user } = useFirestoreUser(
    firestore,
    authUser.uid || ''
  );

  // Lookup user permissions
  const hasUpdateCompanySettingsPermission =
    user && canUpdateCompanySettings(user);
  const id = typeof propertyId === 'string' ? propertyId : propertyId[0];

  // Load Property
  let property = { name: 'loading' };
  const { data: propertyData, status: propertyStatus } = useProperty(
    firestore,
    id
  );

  // Load Trello user
  const { data: trelloUser, status: trelloUserStatus } =
    useTrelloIntegration(firestore);

  // Load Trello data for property
  const { data: trelloProperty, status: trelloPropertyStatus } =
    useTrelloProperty(firestore, id);

  // Load Boards
  const {
    data: trelloBoards,
    status: trelloBoardsStatus,
    error: boardsError
  } = useTrelloBoards();

  const redirectToProperty = () => {
    Router.push(`/properties/edit/${id}`);
  };

  // Redirect to properties if property doesn't exist
  if (id !== 'new') {
    property = { ...propertyData, id } as propertyModel;
  } else {
    sendNotification('Property does not exist', {
      type: 'error'
    });
    Router.push('/properties');
  }
  // Redirect to property on boards loading failure
  if (boardsError) {
    sendNotification(
      'There was a failure on Trello Boards load, please try again',
      {
        type: 'error'
      }
    );
    redirectToProperty();
  }

  // Page loading
  let isLoaded = false;
  if (
    propertyStatus === 'success' &&
    userStatus === 'success' &&
    trelloUserStatus === 'success' &&
    trelloPropertyStatus === 'success' &&
    trelloBoardsStatus === 'success'
  ) {
    isLoaded = true;
  }

  return (
    <MainLayout user={user}>
      {isLoaded ? (
        <PropertyEditTrello
          property={property}
          trelloUser={trelloUser}
          trelloProperty={trelloProperty}
          hasUpdateCompanySettingsPermission={
            hasUpdateCompanySettingsPermission
          }
          trelloBoards={trelloBoards}
          redirectToProperty={redirectToProperty}
          user={user}
        />
      ) : (
        <LoadingHud />
      )}
    </MainLayout>
  );
};

export default Page;
