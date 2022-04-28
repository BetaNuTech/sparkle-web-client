import { useState } from 'react';
import slackApi from '../../../common/services/api/slack';
import BaseError from '../../../common/models/errors/baseError';
import ErrorBadRequest from '../../../common/models/errors/badRequest';
import ErrorForbidden from '../../../common/models/errors/forbidden';
import ErrorUnauthorized from '../../../common/models/errors/unauthorized';
import ErrorNotFound from '../../../common/models/errors/notFound';
import errorReports from '../../../common/services/api/errorReports';
import ErrorServerInternal from '../../../common/models/errors/serverInternal';

const PREFIX = 'features: Settings: hooks: useSlack:';

export const USER_NOTIFICATIONS = {
  unpermissioned:
    'You do not have permission to update Slack Authorization, please contact an admin',
  badRequest: 'Failed to complete Slack Authorization due to bad request',
  notFound: '',
  internalServer:
    'Failed to complete Slack Authorization, please try again or contact the tech team'
};

export const USER_NOTIFICATIONS_DELETE = {
  unpermissioned:
    'You do not have permission to delete Slack Authorization, please contact an admin',
  badRequest: 'Failed to delete Slack Authorization due to bad request',
  notFound: 'Slack app first needs to be installed to your workspace',
  internalServer:
    'Failed to delete Slack Authorization, please try again or contact the tech team'
};

export const USER_NOTIFICATIONS_UPDATE_CHANNEL = {
  unpermissioned:
    'You do not have permission to update the default Slack channel, please contact an admin',
  badRequest: 'Failed to update Slack channel due to bad request',
  notFound: 'Slack app first needs to be installed to your workspace',
  internalServer:
    'Failed to update the Slack default channel, please try again or contact the tech team'
};

type userNotifications = (message: string, options?: any) => any;

interface useSlackReturn {
  isLoading: boolean;
  hasError: boolean;
  onAuthorizeSlack(authToken: string): void;
  reAuthorize(): void;
  onDelete(): void;
  onSetChannelName(initialValue: string): void;
  isUpdatingChannel: boolean;
  onUpdateChannelName(channelName: string): void;
  token: string;
}

/* eslint-disable */
const useSlack = (
  sendNotification: userNotifications,
  redirectUri: string
): useSlackReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdatingChannel, setIsUpdatingChannel] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [token, setToken] = useState(null);

  const handleErrorResponse = (
    error: BaseError,
    userNotifications = USER_NOTIFICATIONS
  ) => {
    const {
      badRequest,
      unpermissioned,
      internalServer,
      notFound = ''
    } = userNotifications;
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

    if (error instanceof ErrorNotFound) {
      errorMessage = notFound;
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
      await slackApi.createAuthorization(data);
      setToken(null);
    } catch (err) {
      setHasError(true);
      handleErrorResponse(err, USER_NOTIFICATIONS);
    }
    setIsLoading(false);
  };

  const reAuthorize = () => {
    onAuthorizeSlack(token);
  };

  const onDelete = async () => {
    setIsLoading(true);
    try {
      // eslint-disable-next-line import/no-named-as-default-member
      await slackApi.deleteAuthorization();
    } catch (err) {
      handleErrorResponse(err, USER_NOTIFICATIONS_DELETE);
    }
    setIsLoading(false);
  };

  const onUpdateChannelName = async (defaultChannelName: string) => {
    setIsUpdatingChannel(true);
    try {
      // eslint-disable-next-line import/no-named-as-default-member
      await slackApi.updateAuthorization({ defaultChannelName });
    } catch (err) {
      handleErrorResponse(err, USER_NOTIFICATIONS_UPDATE_CHANNEL);
    }
    setIsUpdatingChannel(false);
  };

  const onSetChannelName = (initialValue: string) => {
    const result = prompt('Enter System Channel Name', initialValue);
    const hasUserCanceled = result === null;
    const channelName = `${result || ''}`.trim();
    const isUpdated = channelName !== initialValue;

    if (hasUserCanceled || !isUpdated) {
      return;
    }

    if (channelName.length > 80) {
      return sendNotification(
        'Channel names may not be longer than 80 characters.',
        {
          type: 'error'
        }
      );
    }

    onUpdateChannelName(channelName);
  };

  return {
    isLoading,
    hasError,
    onAuthorizeSlack,
    reAuthorize,
    onDelete,
    onSetChannelName,
    isUpdatingChannel,
    onUpdateChannelName,
    token
  };
};

export default useSlack;
