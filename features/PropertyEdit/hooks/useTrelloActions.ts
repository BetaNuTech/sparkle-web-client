import { useState } from 'react';

import trelloApi, {
  trelloBoard,
  trelloList
} from '../../../common/services/api/trello';
import propertyTrelloIntegrationModel from '../../../common/models/propertyTrelloIntegration';
import errorReports from '../../../common/services/api/errorReports';

import ErrorConflictingRequest from '../../../common/models/errors/conflictingRequest';

const PREFIX = 'features: EditProperty: hooks: useTrelloActiions:';

type RecordSelection = trelloList | trelloBoard;

export interface Selection {
  openBoard?: RecordSelection;
  openList?: RecordSelection;
  closeBoard?: RecordSelection;
  closeList?: RecordSelection;
}
interface useTrelloActiionsResult {
  isLoading: boolean;
  updateTrelloIntegration: (selectedOptions: Selection) => void;
  resetTrello(): void;
  isResetting: boolean;
}

type userNotifications = (message: string, options?: any) => any;

export default function useTrelloActiions(
  propertyId: string,
  sendNotification: userNotifications
): useTrelloActiionsResult {
  const [isLoading, setIsLoading] = useState(false);
  const [isResetting, setIsRelsetting] = useState(false);

  // Update a property's trello integration
  const updateTrelloIntegration = async (selections: Selection) => {
    setIsLoading(true);
    const payload = {} as propertyTrelloIntegrationModel;

    // Update closing board
    if (selections.closeBoard) {
      payload.closedBoard = selections.closeBoard.id;
      payload.closedBoardName = selections.closeBoard.name;
    }

    // Update closing list
    if (selections.closeList) {
      payload.closedList = selections.closeList.id;
      payload.closedListName = selections.closeList.name;
    }

    // Update opening board
    if (selections.openBoard) {
      payload.openBoard = selections.openBoard.id;
      payload.openBoardName = selections.openBoard.name;
    }

    // Update opening list
    if (selections.openList) {
      payload.openList = selections.openList.id;
      payload.openListName = selections.openList.name;
    }

    try {
      await trelloApi.updatePropertyTrello(propertyId, payload);
      sendNotification('Trello settings were successfuly updated', {
        type: 'success'
      });
    } catch (err) {
      let errMessage =
        'Failed to update the property’s Trello configuration, please try again or contact an admin';
      if (err instanceof ErrorConflictingRequest) {
        errMessage = 'Please authorize Trello for your organization';
      }

      // Send success notification
      sendNotification(errMessage, {
        type: 'error'
      });
      const wrappedErr = Error(
        `${PREFIX} updateTrelloIntegration: failed: ${err}`
      );
      // Log issue and send error report
      // eslint-disable-next-line import/no-named-as-default-member
      errorReports.send(wrappedErr);
    }
    setIsLoading(false);
  };

  // Update a property's trello integration
  const resetTrello = async () => {
    setIsRelsetting(true);

    try {
      await trelloApi.resetPropertyTrello(propertyId);
      sendNotification('Trello settings were successfuly reseted', {
        type: 'success'
      });
    } catch (err) {
      // Send success notification
      sendNotification(
        'Failed to reset the property’s Trello configuration, please try again or contact an admin',
        {
          type: 'error'
        }
      );
      const wrappedErr = Error(`${PREFIX} resetTrello: failed: ${err}`);
      // Log issue and send error report
      // eslint-disable-next-line import/no-named-as-default-member
      errorReports.send(wrappedErr);
    }
    setIsRelsetting(false);
  };

  return { isLoading, updateTrelloIntegration, resetTrello, isResetting };
}
