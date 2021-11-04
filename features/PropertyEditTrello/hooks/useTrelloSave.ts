import { useState } from 'react';
import Router from 'next/router';
import firebase from 'firebase/app';
import IntegrationsDb from '../../../common/services/firestore/integrations';
import propertyTrelloIntegrationModel from '../../../common/models/propertyTrelloIntegration';
import errorReports from '../../../common/services/api/errorReports';
import globalNotification from '../../../common/services/firestore/notifications';
import { getUserFullname } from '../../../common/utils/user';
import userModel from '../../../common/models/user';

const PREFIX = 'features: Trello: hooks: useTrelloSave:';

interface RecordSelection {
  id: string;
  name: string;
}

export interface Selection {
  openBoard?: RecordSelection;
  openList?: RecordSelection;
  closeBoard?: RecordSelection;
  closeList?: RecordSelection;
}
interface useTrelloSaveResult {
  isLoading: boolean;
  updateTrelloIntegration: (
    propertyId: string,
    selectedOptions: Selection,
    previousSelection: propertyTrelloIntegrationModel
  ) => Promise<propertyTrelloIntegrationModel>;
}

type userNotifications = (message: string, options?: any) => any;

export default function useTrelloSave(
  firestore: firebase.firestore.Firestore,
  sendNotification: userNotifications,
  user: userModel
): useTrelloSaveResult {
  const [isLoading, setIsLoading] = useState(false);

  // Update a property's trello integration
  const updateTrelloIntegration = (
    propertyId: string,
    selections: Selection,
    previousSelection: propertyTrelloIntegrationModel
  ): Promise<propertyTrelloIntegrationModel> => {
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

    return IntegrationsDb.upsertPropertyTrelloRecord(
      firestore,
      propertyId,
      payload
    )
      .catch((err) => {
        // Create or update property failure
        sendNotification('Request failed, please try again.', {
          type: 'error'
        });
        const wrappedErr = Error(
          `${PREFIX} updateTrelloIntegration: failed: ${err}`
        );
        // Log issue and send error report
        // eslint-disable-next-line import/no-named-as-default-member
        errorReports.send(wrappedErr);
        return Promise.reject(wrappedErr);
      })
      .then(async (updatedPropertyTrelloIntegration) => {
        // Redirect user back to property profile
        Router.push(`/properties/edit/${propertyId}`);

        // Send success notification
        sendNotification('Trello settings were successfuly updated', {
          type: 'success'
        });
        try {
          const authorName = getUserFullname(user);
          const authorEmail = user.email;
          const previousOpenBoard =
            previousSelection.openBoardName || 'NOT SET';
          const previousOpenList = previousSelection.openListName || 'NOT SET';
          const previousClosedBoard =
            previousSelection.closedBoardName || 'NOT SET';
          const previousClosedList =
            previousSelection.closedListName || 'NOT SET';
          const currentOpenBoard = payload.openBoardName || 'NOT SET';
          const currentOpenList = payload.openListName || 'NOT SET';
          const currentClosedBoard = payload.closedBoardName || 'NOT SET';
          const currentClosedList = payload.closedListName || 'NOT SET';

          // Send global notification for inspection delete
          // eslint-disable-next-line import/no-named-as-default-member
          await globalNotification.send(firestore, {
            title: 'Trello Settings Change for Property',
            // eslint-disable-next-line import/no-named-as-default-member
            summary: globalNotification.compileTemplate(
              'property-trello-integration-update-summary',
              {
                authorName
              }
            ),
            // eslint-disable-next-line import/no-named-as-default-member
            markdownBody: globalNotification.compileTemplate(
              'property-trello-integration-update-markdown-body',
              {
                previousOpenBoard,
                previousOpenList,
                previousClosedBoard,
                previousClosedList,
                currentOpenBoard,
                currentOpenList,
                currentClosedBoard,
                currentClosedList,
                authorName,
                authorEmail
              }
            ),
            property: propertyId
          });
          // fail silently
        } catch (err) {} // eslint-disable-line
        return updatedPropertyTrelloIntegration;
      })
      .finally(() => setIsLoading(false));
  };

  return { isLoading, updateTrelloIntegration };
}
