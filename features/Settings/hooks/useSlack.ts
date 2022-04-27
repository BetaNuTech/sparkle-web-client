import { useState } from 'react';
import slackApi from '../../../common/services/api/slack';
import BaseError from '../../../common/models/errors/baseError';
import ErrorBadRequest from '../../../common/models/errors/badRequest';
import ErrorForbidden from '../../../common/models/errors/forbidden';
import ErrorUnauthorized from '../../../common/models/errors/unauthorized';
import errorReports from '../../../common/services/api/errorReports';
import ErrorServerInternal from '../../../common/models/errors/serverInternal';

const PREFIX = 'features: Settings: hooks: useSlack:';

export const USER_NOTIFICATIONS = {
  unpermissioned:
    'You do not have permission to update Slack Authorization, please contact an admin',
  badRequest: 'Failed to complete Slack Authorization due to bad request',
  internalServer:
    'Failed to complete Slack Authorization, please try again or contact the tech team'
};

type userNotifications = (message: string, options?: any) => any;

interface useSlackReturn {
  isLoading: boolean;
  hasError: boolean;
  onAuthorizeSlack(authToken: string): void;
  reAuthorize(): void;
}

/* eslint-disable */
const useSlack = (
  sendNotification: userNotifications,
  redirectUri: string
): useSlackReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [token, setToken] = useState(null);

  const handleErrorResponse = (error: BaseError) => {
    const { badRequest, unpermissioned, internalServer } = USER_NOTIFICATIONS;

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

  const onAuthorizeSlack = async (slackCode: string) => {
    setToken(slackCode);
    setHasError(false);
    const data = {
      redirectUri,
      slackCode
    };
    setIsLoading(true);

    try {
      // eslint-disable-next-line import/no-named-as-default-member
      await slackApi.authorize(data);
      setToken(null);
    } catch (err) {
      handleErrorResponse(err);
    }
    setIsLoading(false);
  };

  const reAuthorize = () => {
    onAuthorizeSlack(token);
  };

  return {
    isLoading,
    hasError,
    onAuthorizeSlack,
    reAuthorize
  };
};

export default useSlack;
