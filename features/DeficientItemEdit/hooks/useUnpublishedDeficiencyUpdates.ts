import { useEffect, useState } from 'react';
import deficientItemUpdates from '../../../common/services/indexedDB/deficientItemUpdates';
import errorReports from '../../../common/services/api/errorReports';
import DeficientItemLocalUpdates from '../../../common/models/deficientItems/unpublishedUpdates';

const PREFIX = 'features: DeficientItemEdit: hooks: useUnpublishedItemUpdates:';

interface Result {
  status: string;
  data?: DeficientItemLocalUpdates;
}

// Lookup local deficient item updates record
//
// NOTE: this record is entended to be loaded with
//       the page and then discarded.
//       It's purpose is to provide an optional initial
//       form update state, and should not be used
//       determine the latest user updates
export default function useUnpublishedItemUpdates(
  deficiencyId?: string,
  updatedAt?: number
): Result {
  const [status, setStatus] = useState('loading');
  const [data, setData] = useState(null);
  const payload = { status, data };

  // Lookup any local deficiency updates
  const findRecordForDeficiency = async (): Promise<void> => {
    setStatus('loading');

    let result = null;
    try {
      result = await deficientItemUpdates.queryRecord({
        deficiency: deficiencyId
      });
    } catch (err) {
      // eslint-disable-next-line
      errorReports.send(Error(`${PREFIX} findRecordForDeficiency: ${err}`));
      // continue with failure
    }

    // Remove deficient record
    // if deficiency updatedAt does not match with
    // local defficiency createdAt
    // also set result to null.
    if (result?.createdAt !== updatedAt) {
      result = null;
      deleteDeficiencyRecord();
    }
    // remove unwanted keys from updates
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, property, deficiency,inspection , createdAt, ...updates } = result || {};
    setData(updates || null);
    setStatus('success');
  };

  const deleteDeficiencyRecord = async (): Promise<void> => {
    try {
      await deficientItemUpdates.deleteRecord(deficiencyId);
    } catch (err) {
      // eslint-disable-next-line
      errorReports.send(Error(`${PREFIX} deleteDeficiencyRecord: ${err}`));
    }
  };

  // Trigger request
  useEffect(() => {
    if (deficiencyId && updatedAt) {
      findRecordForDeficiency();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deficiencyId, updatedAt]);

  return payload;
}
