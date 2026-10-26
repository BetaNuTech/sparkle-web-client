import { useState, useEffect } from 'react';
import yardiApi from '../../../common/services/api/yardi';
import customValuesModel from '../../../common/models/yardi/customValues';
import errorReports from '../../../common/services/api/errorReports';
import ErrorForbidden from '../../../common/models/errors/forbidden';
import ErrorNotFound from '../../../common/models/errors/notFound';
import ErrorBadGateway from '../../../common/models/errors/badGateway';
import ErrorProxyForbidden from '../../../common/models/errors/proxyForbidden';

const PREFIX = 'features: PropertyWorkOrders: hooks: useCustomValues:';

type userNotifications = (message: string, options?: any) => any;

export const EMPTY_CUSTOM_VALUES: customValuesModel = Object.freeze({
  priorities: [],
  categories: [],
  statuses: [],
  reasons: [],
  resolutions: []
});

interface useCustomValuesResult {
  status: string;
  data: customValuesModel;
}

// Load the values Yardi accepts for a
// property's work order pickers
export default function useCustomValues(
  sendNotification: userNotifications,
  propertyId: string
): useCustomValuesResult {
  const [data, setData] = useState<customValuesModel>(EMPTY_CUSTOM_VALUES);
  const [status, setStatus] = useState('loading');

  const handleErrorResponse = (apiError: Error) => {
    if (apiError instanceof ErrorForbidden) {
      sendNotification(
        'You do not have permission to request Yardi values for this property',
        { type: 'error' }
      );
    } else if (apiError instanceof ErrorProxyForbidden) {
      sendNotification(
        'Either the organization or this property is not properly configured for Yardi',
        { type: 'error' }
      );
    } else if (apiError instanceof ErrorNotFound) {
      sendNotification('Yardi values requested for an unknown property', {
        type: 'error'
      });
    } else if (apiError instanceof ErrorBadGateway) {
      sendNotification(
        'Yardi could not provide its work order values, please try again.',
        { type: 'error' }
      );
    } else {
      sendNotification(
        'Could not load Yardi work order values, please try again or contact an admin.',
        { type: 'error' }
      );
      // eslint-disable-next-line import/no-named-as-default-member
      errorReports.send(
        Error(`${PREFIX} Could not complete custom values load operation`)
      );
    }

    setStatus('error');
  };

  useEffect(() => {
    yardiApi
      .getCustomValuesRequest(propertyId)
      .then((result) => {
        setData(result);
        setStatus('success');
      })
      .catch(handleErrorResponse);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyId]);

  return { status, data };
}
