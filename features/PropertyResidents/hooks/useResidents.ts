import { useState, useEffect } from 'react';
import Router from 'next/router';
import yardiApi from '../../../common/services/api/yardi';
import yardiResidentModel from '../../../common/models/yardi/resident';
import yardiOccupantModel from '../../../common/models/yardi/occupant';
import errorReports from '../../../common/services/api/errorReports';
import ErrorForbidden from '../../../common/models/errors/forbidden';
import ErrorNotFound from '../../../common/models/errors/notFound';
import ErrorProxyForbidden from '../../../common/models/errors/proxyForbidden';

const PREFIX = 'features: PropertyResidents: hooks: useResidents:';

type userNotifications = (message: string, options?: any) => any;

type Data = {
  residents: yardiResidentModel[];
  occupants: yardiOccupantModel[];
};

interface Result {
  status: string;
  data: Data;
}

export default function useWorkOrders(
  sendNotification: userNotifications,
  propertyId: string
): Result {
  const [data, setData] = useState({});
  const [status, setStatus] = useState('loading');

  const handleErrorResponse = (apiError: Error) => {
    if (apiError instanceof ErrorForbidden) {
      sendNotification(
        'You do not have permission to request residents for this property',
        { type: 'error' }
      );
    } else if (apiError instanceof ErrorProxyForbidden) {
      sendNotification(
        'Either the organization or this property is not properly configured for Yardi',
        { type: 'error' }
      );
    } else if (apiError instanceof ErrorNotFound) {
      sendNotification(
        'The residents requested belong to an unknown property',
        { type: 'error' }
      );
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
        Error(`${PREFIX} Could not complete resident load operation`)
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
    yardiApi
      .getResidentsRequest(propertyId)
      .then((result) => {
        setData(result);
        setStatus('success');
      })
      .catch(handleErrorResponse);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyId]);

  return payload as Result;
}
