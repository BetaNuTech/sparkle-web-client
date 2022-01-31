import { useState } from 'react';
import deficientItemsApi from '../../../common/services/api/deficientItems';
import errorReports from '../../../common/services/api/errorReports';
import BaseError from '../../../common/models/errors/baseError';

const PREFIX = 'features: DeficientItemEdit: hooks: useTrelloCard:';

interface useTrelloCardResult {
  onCreateTrelloCard(): void;
  isLoading: boolean;
}

type userNotifications = (message: string, options?: any) => any;

export default function useTrelloCard(
  sendNotification: userNotifications,
  deficiencyId: string
): useTrelloCardResult {
  const [isLoading, setIsLoading] = useState(false);

  const handleSuccessResponse = () => {
    sendNotification('Trello card now available', {
      type: 'success'
    });
  };

  const handleErrorResponse = (error: BaseError) => {
    sendNotification('Failed to create Trello card, please try again', {
      type: 'error'
    });

    // Log issue and send error report
    // of user's missing properties
    // eslint-disable-next-line no-case-declarations
    const wrappedErr = Error(`${PREFIX} handleErrorResponse: ${error}`);

    // eslint-disable-next-line import/no-named-as-default-member
    errorReports.send(wrappedErr);
  };

  const onCreateTrelloCard = async () => {
    setIsLoading(true);
    try {
      // eslint-disable-next-line import/no-named-as-default-member
      await deficientItemsApi.createTrelloCard(deficiencyId);
      handleSuccessResponse();
    } catch (err) {
      handleErrorResponse(err);
    }
    setIsLoading(false);
  };

  return {
    onCreateTrelloCard,
    isLoading
  };
}
