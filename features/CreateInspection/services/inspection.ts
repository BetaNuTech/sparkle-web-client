import templateModel from '../../../common/models/template';
import inspectionsApi from '../../../common/services/api/inspections';
import errorReports from '../../../common/services/api/errorReports';
import inspectionModel from '../../../common/models/inspection';

const PREFIX = 'feature: CreateInspection: services: createRecord:';

type userNotifications = (message: string, options?: any) => any;

const createRecord = (
  propertyId: string,
  template: templateModel,
  sendNotification: userNotifications
): Promise<string> => {
  const request = { template: template.id };

  // eslint-disable-next-line import/no-named-as-default-member
  return inspectionsApi
    .createRecord(propertyId, request)
    .then((inspection: inspectionModel) => {
      sendNotification(`Successfully created inspection: ${template.name}`, {
        type: 'success'
      });
      return Promise.resolve(inspection.id);
    })
    .catch((err) => {
      const wrappedErr = Error(
        `${PREFIX} createInspection: failed to create inspection: ${err}`
      );
      // Send notification if create record fails
      sendNotification('Failed to create an inspection, please try again', {
        type: 'error'
      });
      // Also send the error report to backend
      // eslint-disable-next-line import/no-named-as-default-member
      errorReports.send(wrappedErr);
      return Promise.reject(wrappedErr);
    });
};

export default { createRecord };
