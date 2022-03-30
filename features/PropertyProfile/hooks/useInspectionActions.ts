import { useState } from 'react';
import moment from 'moment';
import inspectionFirestoreApi from '../../../common/services/firestore/inspections';
import inspectionModel from '../../../common/models/inspection';
import errorReports from '../../../common/services/api/errorReports';
import globalNotification from '../../../common/services/firestore/notifications';
import userModel from '../../../common/models/user';
import { getUserFullname } from '../../../common/utils/user';
import inspectionApi from '../../../common/services/api/inspections';
import BaseError from '../../../common/models/errors/baseError';
import ErrorBadRequest from '../../../common/models/errors/badRequest';
import ErrorForbidden from '../../../common/models/errors/forbidden';
import ErrorUnauthorized from '../../../common/models/errors/unauthorized';
import ErrorConflictingRequest from '../../../common/models/errors/conflictingRequest';

const PREFIX = 'features: propertyProfile: hooks: useInspectionActions:';

export const USER_NOTIFICATIONS = {
  badRequest: 'Updates are invalid, please correct issues or contact an admin',
  unpermissioned:
    'You do not have permission to make these updates, please login again or contact an admin',
  generic: 'Failed to update template, please try again',
  success: 'Inspection moved successfully'
};

interface Returned {
  queuedInspectionForDeletion: inspectionModel | null;
  queueInspectionForDelete: (inspection: inspectionModel) => any;
  confirmInspectionDelete: () => Promise<any>;
  confirmMoveInspection(property: string): void;
  setQueueInspectionForMove(inspection: inspectionModel): void;
  queuedInspectionForMove: inspectionModel;
  isMoving: boolean;
}
type userNotifications = (message: string, options?: any) => any;

// Query inspection to delete
// and send delete confirmation
/* eslint-disable */
const useInspectionActions = (
  firestore: any,
  sendNotification: userNotifications,
  user: userModel
): Returned => {
  /* eslint-enable */
  const [queuedInspectionForDeletion, setQueueDeleteInspection] =
    useState(null);

  const [isMoving, setIsMoving] = useState(false);
  const [queuedInspectionForMove, setQueueInspectionForMove] = useState(null);

  // Set/unset the inspection
  // queued to be deleted
  const queueInspectionForDelete = (inspection: null | inspectionModel) => {
    setQueueDeleteInspection(inspection);
  };

  // Request to delete the queued inspection
  const confirmInspectionDelete = async (): Promise<any> => {
    try {
      await inspectionFirestoreApi.deleteRecord(
        firestore,
        queuedInspectionForDeletion.id
      );
    } catch (err) {
      // Handle error
      const wrappedErr = Error(`${PREFIX} confirmInspectionDelete: ${err}`);
      sendNotification('Failed to delete inspection, please try again', {
        type: 'error'
      });
      errorReports.send(wrappedErr); // eslint-disable-line
      return wrappedErr;
    }

    const { creationDate: startDate, templateName } =
      queuedInspectionForDeletion;
    const authorName = getUserFullname(user);
    const authorEmail = user.email;
    const currentDate = moment().format('MMM DD');

    // Send global notification for inspection delete
    // eslint-disable-next-line import/no-named-as-default-member
    globalNotification.send(firestore, {
      creator: user.id,
      title: 'Inspection Deletion',
      // eslint-disable-next-line import/no-named-as-default-member
      summary: globalNotification.compileTemplate('inspection-delete-summary', {
        authorName,
        currentDate
      }),

      // eslint-disable-next-line import/no-named-as-default-member
      markdownBody: globalNotification.compileTemplate(
        'inspection-delete-markdown-body',
        {
          startDate,
          templateName,
          authorName,
          authorEmail
        }
      )
    });
  };

  const handleErrorResponse = (error: BaseError) => {
    if (
      error instanceof ErrorBadRequest ||
      error instanceof ErrorConflictingRequest
    ) {
      sendNotification(USER_NOTIFICATIONS.badRequest, {
        type: 'error'
      });
    } else if (
      error instanceof ErrorForbidden ||
      error instanceof ErrorUnauthorized
    ) {
      sendNotification(USER_NOTIFICATIONS.unpermissioned, {
        type: 'error'
      });
    } else {
      sendNotification(USER_NOTIFICATIONS.generic, {
        type: 'error'
      });
    }

    // Log issue and send error report
    // eslint-disable-next-line no-case-declarations
    const wrappedErr = Error(`${PREFIX} handleErrorResponse: ${error}`);

    // eslint-disable-next-line import/no-named-as-default-member
    errorReports.send(wrappedErr);
  };
  const confirmMoveInspection = async (property: string) => {
    setIsMoving(true);
    try {
      // eslint-disable-next-line import/no-named-as-default-member
      await inspectionApi.updateInspection(queuedInspectionForMove.id, {
        property
      });
      sendNotification(USER_NOTIFICATIONS.success, {
        type: 'success'
      });
    } catch (err) {
      handleErrorResponse(err);
    }

    setQueueInspectionForMove(null);
    setIsMoving(false);
  };

  return {
    queuedInspectionForDeletion,
    queueInspectionForDelete,
    confirmInspectionDelete,
    queuedInspectionForMove,
    setQueueInspectionForMove,
    confirmMoveInspection,
    isMoving
  };
};

export default useInspectionActions;
