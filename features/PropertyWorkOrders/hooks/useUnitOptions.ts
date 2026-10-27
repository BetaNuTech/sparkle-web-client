import { useState, useEffect } from 'react';
import yardiApi from '../../../common/services/api/yardi';
import errorReports from '../../../common/services/api/errorReports';
import ErrorBadRequest from '../../../common/models/errors/badRequest';
import ErrorForbidden from '../../../common/models/errors/forbidden';
import ErrorNotFound from '../../../common/models/errors/notFound';
import ErrorBadGateway from '../../../common/models/errors/badGateway';
import ErrorProxyForbidden from '../../../common/models/errors/proxyForbidden';
import { toUnitOptions, UnitOption } from '../utils/unitOptions';

const PREFIX = 'features: PropertyWorkOrders: hooks: useUnitOptions:';

interface useUnitOptionsResult {
  status: string;
  data: UnitOption[];
}

// Expected Yardi failures: the form
// quietly falls back to a typed unit
const KNOWN_ERRORS = [
  ErrorBadRequest,
  ErrorForbidden,
  ErrorNotFound,
  ErrorBadGateway,
  ErrorProxyForbidden
];

// Load the units a work order can be
// created for, from the property's
// current residents.  Never blocks the
// form: on any failure the status is
// "error" and the unit is typed instead.
export default function useUnitOptions(
  propertyId: string
): useUnitOptionsResult {
  const [data, setData] = useState<UnitOption[]>([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let isCurrent = true;
    setStatus('loading');

    yardiApi
      .getResidentsRequest(propertyId)
      .then((result) => {
        if (!isCurrent) return;
        setData(toUnitOptions(result.residents));
        setStatus('success');
      })
      .catch((err) => {
        if (!isCurrent) return;
        const isKnown = KNOWN_ERRORS.some((Known) => err instanceof Known);
        if (!isKnown) {
          // eslint-disable-next-line import/no-named-as-default-member
          errorReports.send(
            Error(`${PREFIX} Could not load residents for unit picker: ${err}`)
          );
        }
        setStatus('error');
      });

    return () => {
      isCurrent = false;
    };
  }, [propertyId]);

  return { status, data };
}
