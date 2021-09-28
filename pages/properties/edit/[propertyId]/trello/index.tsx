import 'firebase/firestore';
import { FunctionComponent } from 'react';
import { useFirestore, useUser } from 'reactfire';
import Router, { useRouter } from 'next/router';
import useNotifications from '../../../../../common/hooks/useNotifications'; // eslint-disable-line
import notifications from '../../../../../common/services/notifications';
import useProperty from '../../../../../common/hooks/useProperty';
import useTrelloBoards from '../../../../../features/Trello/hooks/useTrelloBoards';
import useTrelloUser from '../../../../../features/Trello/hooks/useTrelloUser';
import userTrelloProperty from '../../../../../features/Trello/hooks/useTrelloProperty';
import { canUpdateCompanySettings } from '../../../../../common/utils/userPermissions';
import { MainLayout } from '../../../../../common/MainLayout/index';
import Trello from '../../../../../features/Trello/index';
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
  let property = {};
  const { data, status: propertyStatus } = useProperty(firestore, id);

  // Load Trello user
  const { data: trelloUser, status: trelloUserStatus } =
    useTrelloUser(firestore);

  // Load Trello data for property
  const { data: trelloProperty, status: trelloPropertyStatus } =
    userTrelloProperty(firestore, id);

  // Load Boards
  const {
    data: trelloBoards,
    status: trelloBoardsStatus,
    error: boardsError
  } = useTrelloBoards();

  // Redirect to properties if property doesn't exist
  if (id !== 'new') {
    property = { ...data, id };
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
    Router.push(`/properties/edit/${id}`);
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
    <MainLayout>
      {isLoaded ? (
        <Trello
          property={property}
          trelloUser={trelloUser}
          trelloProperty={trelloProperty}
          hasUpdateCompanySettingsPermission={
            hasUpdateCompanySettingsPermission
          }
          trelloBoards={trelloBoards}
        />
      ) : (
        <LoadingHud />
      )}
    </MainLayout>
  );
};

export default Page;
