import 'firebase/firestore';
import { ReactElement, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useUser, useFirestore } from 'reactfire';
import { MainLayout } from '../../common/MainLayout';
import useFirestoreUser from '../../common/hooks/useFirestoreUser';

import LoadingHud from '../../common/LoadingHud';
import useNotifications from '../../common/hooks/useNotifications';
import notifications from '../../common/services/notifications';

import { canViewTemplates } from '../../common/utils/userPermissions';
import useTemplates from '../../common/hooks/useTemplates';
import useTemplateCategories from '../../common/hooks/useTemplateCategories';
import Templates from '../../features/Templates';

const Page: React.FC = (): ReactElement => {
  const firestore = useFirestore();
  // eslint-disable-next-line
  const sendNotification = notifications.createPublisher(useNotifications());

  const { data: authUser } = useUser();
  const router = useRouter();
  const { data: user, status: userStatus } = useFirestoreUser(
    firestore,
    authUser.uid || ''
  );

  // Fetch all templates
  const { data: templates, status: templatesStatus } = useTemplates(firestore);

  // Fetch all  template categories
  const { data: templateCategories, status: tamplateCatStatus } =
    useTemplateCategories(firestore);

  const canView = useMemo(
    () => userStatus === 'success' && canViewTemplates(user),
    [userStatus, user]
  );

  // using this useEffect so it only
  // sends single notification to user
  useEffect(() => {
    // Redirect unauthorized user with error notification
    if (!canView && userStatus === 'success') {
      sendNotification('You do not have permission to manage templates.', {
        type: 'error'
      });
      router.push('/properties');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userStatus, canView]);

  let isLoaded = false;
  if (
    userStatus === 'success' &&
    templatesStatus === 'success' &&
    tamplateCatStatus === 'success' &&
    canView
  ) {
    isLoaded = true;
  }

  return (
    <MainLayout user={user}>
      {isLoaded ? (
        <Templates
          templates={templates}
          templateCategories={templateCategories}
          user={user}
          sendNotification={sendNotification}
        />
      ) : (
        <LoadingHud />
      )}
    </MainLayout>
  );
};

export default Page;
