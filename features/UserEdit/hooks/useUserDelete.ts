import { useState } from 'react';

import Router from 'next/router';
import UserModel from '../../../common/models/user';
import userApi from '../../../common/services/api/users';
import BaseError from '../../../common/models/errors/baseError';
import ErrorForbidden from '../../../common/models/errors/forbidden';
import ErrorUnauthorized from '../../../common/models/errors/unauthorized';
import errorReports from '../../../common/services/api/errorReports';
import ErrorNotFound from '../../../common/models/errors/notFound';
import ErrorServerInternal from '../../../common/models/errors/serverInternal';

const PREFIX = 'features: UserEdit: hooks: useUserDelete:';

export const USER_NOTIFICATIONS = {
  notFound: 'This user no longer exists',
  unpermissioned: 'You do not have permission to delete users',
  internalServer: 'Unknown error please try again',
  success: 'User successfully deleted'
};

type userNotifications = (message: string, options?: any) => any;

interface useUserDeleteReturn {
  isDeleting: boolean;
  onDelete(): void;
}

/* eslint-disable */
const useUserDelete = (
  user: UserModel,
  sendNotification: userNotifications
): useUserDeleteReturn => {
  const [isLoading, setIsLoading] = useState(false);

  const handleErrorResponse = (error: BaseError) => {
    let errorMessage = null;

    if (error instanceof ErrorNotFound) {
      errorMessage = USER_NOTIFICATIONS.notFound;
    }
    if (error instanceof ErrorServerInternal) {
      errorMessage = USER_NOTIFICATIONS.internalServer;
    }

    if (error instanceof ErrorUnauthorized || error instanceof ErrorForbidden) {
      errorMessage = USER_NOTIFICATIONS.unpermissioned;
      // eslint-disable-next-line no-case-declarations
      const wrappedErr = Error(`${PREFIX} handleCreateErrorResponse: ${error}`);

      // eslint-disable-next-line import/no-named-as-default-member
      errorReports.send(wrappedErr);
    }

    // send error notifications
    if (errorMessage) {
      sendNotification(errorMessage, {
        type: 'error'
      });
    }
  };

  const onDelete = async () => {
    setIsLoading(true);
    try {
      // eslint-disable-next-line import/no-named-as-default-member
      await userApi.deleteRecord(user.id);
      // Redirect to users page
      Router.push('/users');
      // Send user facing notification
      sendNotification(USER_NOTIFICATIONS.success, {
        type: 'success'
      });
    } catch (err) {
      handleErrorResponse(err);
    }
    setIsLoading(false);
  };

  return {
    isDeleting: isLoading,
    onDelete
  };
};

export default useUserDelete;
