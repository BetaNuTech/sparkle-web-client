import { useState } from 'react';
import inspectionsApi from '../../../common/services/api/inspections';
import inspectionModel from '../../../common/models/inspection';
import inspectionTemplateUpdateModel from '../../../common/models/inspections/templateUpdate';
import errorReports from '../../../common/services/api/errorReports';
import ErrorForbidden from '../../../common/models/errors/forbidden';
import ErrorUnauthorized from '../../../common/models/errors/unauthorized';
import ErrorBadRequest, {
  BadRequestItem
} from '../../../common/models/errors/badRequest';

const PREFIX = 'features: PropertyUpdateInspection: hooks: usePublishUpdates:';

type userNotifications = (message: string, options?: any) => any;
interface useInspectionUpdateResult {
  isLoading: boolean;
  updateInspectionTemplate(
    inspectionId: string,
    inspection: inspectionTemplateUpdateModel
  ): Promise<inspectionModel | any>;
  errors: BadRequestItem[];
}

export default function usePublishUpdates(
  sendNotification: userNotifications
): useInspectionUpdateResult {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<BadRequestItem[]>([]);

  // Show success notification after updating an
  // inspection's template
  const handleSuccessResponse = () => {
    sendNotification('Inspection successfully updated', {
      type: 'success'
    });
  };

  const handleErrorResponse = (apiError: Error) => {
    if (
      apiError instanceof ErrorForbidden ||
      apiError instanceof ErrorUnauthorized
    ) {
      // User not allowed to create or update inspection
      sendNotification('You are not allowed to update this inspection.', {
        type: 'error'
      });
    } else if (apiError instanceof ErrorBadRequest) {
      setErrors(apiError.errors);
    } else {
      // User not allowed to create or update inspection
      sendNotification(
        'Unexpected error. Please try again, or contact an admin.',
        {
          type: 'error'
        }
      );
      // Log issue and send error report
      // of user's missing properties
      // eslint-disable-next-line no-case-declarations
      const wrappedErr = Error(`${PREFIX} handleErrorResponse: ${apiError}`);
      // eslint-disable-next-line import/no-named-as-default-member
      errorReports.send(wrappedErr);
    }
  };

  const updateInspectionTemplate = (
    inspectionId: string,
    payload: inspectionTemplateUpdateModel
  ): Promise<inspectionModel | any> => {
    setIsLoading(true);
    // eslint-disable-next-line import/no-named-as-default-member
    return inspectionsApi
      .updateInspectionTemplate(inspectionId, payload)
      .then((updatedInspection) => {
        handleSuccessResponse();
        return updatedInspection;
      })
      .catch((err) => {
        handleErrorResponse(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return {
    isLoading,
    updateInspectionTemplate,
    errors
  };
}
