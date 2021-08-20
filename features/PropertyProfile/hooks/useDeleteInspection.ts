import { useState } from 'react';
import moment from 'moment';
import inspectionApi from '../../../common/services/firestore/inspections';
import inspectionModel from '../../../common/models/inspection';
import errorReports from '../../../common/services/api/errorReports';
import globalNotification from '../../../common/services/firestore/notifications';
import userModel from '../../../common/models/user';
import { getUserFullname } from '../../../common/utils/user';

const PREFIX = 'features: propertyProfile: hooks: useDeleteInspection:';
interface Returned {
  queuedInspectionForDeletion: inspectionModel | null;
  queueInspectionForDelete: (inspection: inspectionModel) => any;
  confirmInspectionDelete: () => Promise<any>;
}
type userNotifications = (message: string, options?: any) => any;

// Query inspection to delete
// and send delete confirmation
/* eslint-disable */
const useDeleteInspection = (
  firestore: any,
  sendNotification: userNotifications,
  user: userModel
): Returned => {
  /* eslint-enable */
  const [queuedInspectionForDeletion, setQueueDeleteInspection] =
    useState(null);

  // Set/unset the inspection
  // queued to be deleted
  const queueInspectionForDelete = (inspection: null | inspectionModel) => {
    setQueueDeleteInspection(inspection);
  };

  // Request to delete the queued inspection
  const confirmInspectionDelete = async (): Promise<any> => {
    try {
      await inspectionApi.deleteRecord(
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

  return {
    queuedInspectionForDeletion,
    queueInspectionForDelete,
    confirmInspectionDelete
  };
};

export default useDeleteInspection;
