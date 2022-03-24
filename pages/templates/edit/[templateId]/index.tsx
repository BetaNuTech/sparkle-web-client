import 'firebase/firestore';
import { ReactElement, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useUser, useFirestore } from 'reactfire';
import { MainLayout } from '../../../../common/MainLayout';
import useFirestoreUser from '../../../../common/hooks/useFirestoreUser';

import LoadingHud from '../../../../common/LoadingHud';
import useNotifications from '../../../../common/hooks/useNotifications';
import notifications from '../../../../common/services/notifications';

import { canUpdateTemplate } from '../../../../common/utils/userPermissions';
import useTemplateCategories from '../../../../common/hooks/useTemplateCategories';
import TemplateEdit from '../../../../features/TemplateEdit';
import useTemplate from '../../../../common/hooks/useTemplate';
import useUnpublishedTemplateUpdates from '../../../../features/TemplateEdit/hooks/useUnpublishedTemplateUpdates';

const Page: React.FC = (): ReactElement => {
  const firestore = useFirestore();
  // eslint-disable-next-line
  const sendNotification = notifications.createPublisher(useNotifications());

  const { data: authUser } = useUser();
  const router = useRouter();
  const { templateId } = router.query;
  const { data: user, status: userStatus } = useFirestoreUser(
    firestore,
    authUser.uid || ''
  );

  const id = typeof templateId === 'string' ? templateId : templateId[0];

  // Fetch template data
  const { data: template, status: templateStatus } = useTemplate(firestore, id);

  // Fetch all template categories
  const { data: templateCategories, status: templateCatStatus } =
    useTemplateCategories(firestore);

  // Locally stored user updates to template
  const { data: unpublishedUpdates, status: unpublishedUpdatesStatus } =
    useUnpublishedTemplateUpdates(id);

  const canEdit = useMemo(
    () => userStatus === 'success' && canUpdateTemplate(user),
    [userStatus, user]
  );

  // using this useEffect so it only
  // sends single notification to user
  useEffect(() => {
    // Redirect unauthorized user with error notification
    if (!canEdit && userStatus === 'success') {
      sendNotification('You do not have permission to edit templates.', {
        type: 'error'
      });
      router.push('/templates');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userStatus, canEdit]);

  let isLoaded = false;
  if (
    userStatus === 'success' &&
    templateStatus === 'success' &&
    templateCatStatus === 'success' &&
    unpublishedUpdatesStatus === 'success' &&
    canEdit
  ) {
    isLoaded = true;
  }
  return (
    <MainLayout user={user}>
      {isLoaded ? (
        <TemplateEdit
          template={template}
          unpublishedUpdates={unpublishedUpdates}
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
