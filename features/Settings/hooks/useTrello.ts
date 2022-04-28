import { useState } from 'react';
import trelloApi from '../../../common/services/api/trello';
import BaseError from '../../../common/models/errors/baseError';
import ErrorBadRequest from '../../../common/models/errors/badRequest';
import ErrorForbidden from '../../../common/models/errors/forbidden';
import ErrorUnauthorized from '../../../common/models/errors/unauthorized';
import errorReports from '../../../common/services/api/errorReports';
import ErrorServerInternal from '../../../common/models/errors/serverInternal';
import systemSettings from '../../../config/systemSettings';

const PREFIX = 'features: Settings: hooks: useTrello:';

export const USER_NOTIFICATIONS = {
  unpermissioned:
    'You do not have permission to update Trello Authorization, please contact an admin',
  badRequest: 'Failed to complete Trello Authorization due to bad request',
  internalServer:
    'Failed to complete Trello Authorization, please try again or contact the tech team'
};

export const USER_NOTIFICATIONS_DELETE = {
  unpermissioned:
    'You do not have permission to delete Trello Authorization, please contact an admin',
  badRequest: 'Failed to delete Trello Authorization due to bad request',
  internalServer:
    'Failed to delete Trello Authorization, please try again or contact the tech team'
};

type userNotifications = (message: string, options?: any) => any;

interface useTrelloReturn {
  isLoading: boolean;
  hasError: boolean;
  onAuthorizeTrello(authToken: string): void;
  reAuthorize(): void;
  onDelete(): void;
  token: string;
}

/* eslint-disable */
const useTrello = (sendNotification: userNotifications): useTrelloReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [token, setToken] = useState(null);

  const handleErrorResponse = (error: BaseError, isDeleting = false) => {
    const { badRequest, unpermissioned, internalServer } = isDeleting
      ? USER_NOTIFICATIONS_DELETE
      : USER_NOTIFICATIONS;

    setHasError(true);
    let errorMessage = '';

    if (error instanceof ErrorBadRequest) {
      errorMessage =
        error.errors
          .filter(({ detail }) => Boolean(detail))
          .map(({ detail }) => detail)
          .join(', ') || badRequest; // fallback to default message
    }

    if (error instanceof ErrorUnauthorized || error instanceof ErrorForbidden) {
      errorMessage = unpermissioned;
    }

    if (error instanceof ErrorServerInternal) {
      errorMessage = internalServer;
    }

    // send error notifications
    if (errorMessage) {
      sendNotification(errorMessage, {
        type: 'error'
      });
    }

    // eslint-disable-next-line no-case-declarations
    const wrappedErr = Error(`${PREFIX} handleErrorResponse: ${error}`);
    // eslint-disable-next-line import/no-named-as-default-member
    errorReports.send(wrappedErr);
  };

  const onAuthorizeTrello = async (authToken: string) => {
    setToken(authToken);
    setHasError(false);

    const data = {
      apikey: systemSettings.trello.apiKey,
      authToken
    };
    setIsLoading(true);

    try {
      // eslint-disable-next-line import/no-named-as-default-member
      await trelloApi.createAuthorization(data);
      setToken(null);
    } catch (err) {
      handleErrorResponse(err);
    }
    setIsLoading(false);
  };

  const reAuthorize = () => {
    onAuthorizeTrello(token);
  };

  const onDelete = async () => {
    setIsLoading(true);
    try {
      // eslint-disable-next-line import/no-named-as-default-member
      await trelloApi.deleteAuthorization();
    } catch (err) {
      handleErrorResponse(err, true);
    }
    setIsLoading(false);
  };

  return {
    isLoading,
    hasError,
    onAuthorizeTrello,
    reAuthorize,
    onDelete,
    token
  };
};

export default useTrello;
