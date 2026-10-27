import { useState, useEffect } from 'react';
import Router from 'next/router';
import yardiApi from '../../../common/services/api/yardi';
import workOrderModel from '../../../common/models/yardi/workOrder';
import errorReports from '../../../common/services/api/errorReports';
import ErrorForbidden from '../../../common/models/errors/forbidden';
import ErrorNotFound from '../../../common/models/errors/notFound';
import ErrorBadRequest from '../../../common/models/errors/badRequest';
import ErrorBadGateway from '../../../common/models/errors/badGateway';
import ErrorProxyForbidden from '../../../common/models/errors/proxyForbidden';

const PREFIX = 'features: PropertyWorkOrders: hooks: useWorkOrder:';

type userNotifications = (message: string, options?: any) => any;

interface useWorkOrderResult {
  status: string;
  data: workOrderModel;
  setData(workOrder: workOrderModel): void;
}

// Load a single work order, redirecting
// back to the list when it cannot be shown
export default function useWorkOrder(
  sendNotification: userNotifications,
  propertyId: string,
  workOrderId: string
): useWorkOrderResult {
  const [data, setData] = useState<workOrderModel>(null);
  const [status, setStatus] = useState('loading');

  const handleErrorResponse = (apiError: Error) => {
    if (apiError instanceof ErrorForbidden) {
      sendNotification(
        'You do not have permission to request work orders for this property',
        { type: 'error' }
      );
    } else if (apiError instanceof ErrorProxyForbidden) {
      sendNotification(
        'Either the organization or this property is not properly configured for Yardi',
        { type: 'error' }
      );
    } else if (apiError instanceof ErrorNotFound) {
      sendNotification('This work order could not be found in Yardi', {
        type: 'error'
      });
    } else if (apiError instanceof ErrorBadRequest) {
      sendNotification('The work order requested is not valid', {
        type: 'error'
      });
    } else if (apiError instanceof ErrorBadGateway) {
      sendNotification(
        'Yardi could not process the work order request, please try again.',
        { type: 'error' }
      );
    } else {
      sendNotification(
        'Request failed for unexpected reasons, please try again or contact an admin.',
        { type: 'error' }
      );
      // eslint-disable-next-line import/no-named-as-default-member
      errorReports.send(
        Error(`${PREFIX} Could not complete work order load operation`)
      );
    }

    setStatus('error');
    Router.push(`/properties/${propertyId}/yardi-work-orders`);
  };

  useEffect(() => {
    if (!workOrderId) return;
    setStatus('loading');

    yardiApi
      .getWorkOrderRequest(propertyId, workOrderId)
      .then((result) => {
        setData(result);
        setStatus('success');
      })
      .catch(handleErrorResponse);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyId, workOrderId]);

  return { status, data, setData };
}
