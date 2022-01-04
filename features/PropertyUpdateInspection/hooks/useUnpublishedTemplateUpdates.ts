import { useEffect, useState } from 'react';
import unpublishedTemplateUpdatesModel from '../../../common/models/inspections/unpublishedTemplateUpdate';
import inspectionTemplateUpdates from '../../../common/services/indexedDB/inspectionTemplateUpdates';
import errorReports from '../../../common/services/api/errorReports';

const PREFIX =
  'features: PropertyUpdateInspection: hooks: useUnpublishedTemplateUpdates:';

interface Result {
  status: string;
  data?: unpublishedTemplateUpdatesModel;
}

// Lookup local inspection template updates record
//
// NOTE: this record is entended to be loaded with
//       the page and then discarded.
//       It's purpose is to provide an optional initial
//       form update state, and should not be used
//       determine the latest user updates
export default function useUnpublishedTemplateUpdates(
  inspectionId?: string
): Result {
  const [status, setStatus] = useState('loading');
  const [data, setData] = useState(null);
  const payload = { status, data };

  // Lookup any local inspection updates
  const findRecordForInspection = async (): Promise<void> => {
    setStatus('loading');

    let result = null;
    try {
      result = await inspectionTemplateUpdates.queryRecord({
        inspection: inspectionId
      });
    } catch (err) {
      // eslint-disable-next-line
      errorReports.send(Error(`${PREFIX} findRecordForInspection: ${err}`));
      // continue with failure
    }

    setStatus('success');
    setData(result || null);
  };

  // Trigger request
  useEffect(() => {
    if (inspectionId) {
      findRecordForInspection();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inspectionId]);

  return payload;
}
