import { useState, useEffect } from 'react';
import Router from 'next/router';
import yardiApi, { WorkOrderFilters } from '../../../common/services/api/yardi';
import workOrderModel from '../../../common/models/yardi/workOrder';
import errorReports from '../../../common/services/api/errorReports';
import ErrorForbidden from '../../../common/models/errors/forbidden';
import ErrorNotFound from '../../../common/models/errors/notFound';
import ErrorBadRequest from '../../../common/models/errors/badRequest';
import ErrorBadGateway from '../../../common/models/errors/badGateway';
import ErrorProxyForbidden from '../../../common/models/errors/proxyForbidden';

const PREFIX = 'features: PropertyWorkOrders: hooks: useWorkOrders:';

type userNotifications = (message: string, options?: any) => any;

interface useWorkOrdersResult {
  status: string;
  data: workOrderModel[];
}

export default function useWorkOrders(
  sendNotification: userNotifications,
  propertyId: string,
  filters: WorkOrderFilters = {}
): useWorkOrdersResult {
  const [data, setData] = useState([]);
  const [status, setStatus] = useState('loading');
  const filtersKey = JSON.stringify(filters);

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
      sendNotification(
        'The work orders requested belong to an unknown property',
        { type: 'error' }
      );
    } else if (apiError instanceof ErrorBadRequest) {
      // Bad filter: keep the user on the
      // list so they can correct it
      const { detail } = apiError.errors[0] || ({} as any);
      sendNotification(
        `Work order filters were rejected${detail ? `: ${detail}` : ''}`,
        { type: 'error' }
      );
      setStatus('error');
      return;
    } else if (apiError instanceof ErrorBadGateway) {
      sendNotification(
        'Yardi could not process the work order request, please try again.',
        { type: 'error' }
      );
      setStatus('error');
      return;
    } else {
      sendNotification(
        'Request failed for unexpected reasons, please try again or contact an admin.',
        {
          type: 'error'
        }
      );
      // Log issue and send error report
      // eslint-disable-next-line import/no-named-as-default-member
      errorReports.send(
        Error(`${PREFIX} Could not complete work order load operation`)
      );
    }

    Router.push(`/properties/${propertyId}/`);
  };

  // No access payload
  const payload = {
    status,
    data
  };

  useEffect(() => {
    let isCurrent = true;
    setStatus('loading');

    yardiApi
      .getWorkOrdersRequest(propertyId, filters)
      .then((result) => {
        if (!isCurrent) return; // stale filters
        setData(result);
        setStatus('success');
      })
      .catch((err) => {
        if (isCurrent) handleErrorResponse(err);
      });

    return () => {
      isCurrent = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyId, filtersKey]);

  return payload;
}
