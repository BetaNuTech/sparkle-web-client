import { useEffect, useState } from 'react';
import templateUpdates from '../../../common/services/indexedDB/templateUpdates';
import errorReports from '../../../common/services/api/errorReports';
import TemplateModel from '../../../common/models/template';

const PREFIX = 'features: TemplateEdit: hooks: useUnpublishedTemplateUpdates:';

interface Result {
  status: string;
  data?: TemplateModel;
}

// Lookup local template item updates record
//
// NOTE: this record is entended to be loaded with
//       the page and then discarded.
//       It's purpose is to provide an optional initial
//       form update state, and should not be used
//       determine the latest user updates
export default function useUnpublishedTemplateUpdates(
  templateId?: string
): Result {
  const [status, setStatus] = useState('loading');
  const [data, setData] = useState(null);
  const payload = { status, data };

  // Lookup any local template updates
  const findRecordForTemplate = async (): Promise<void> => {
    setStatus('loading');

    let result = null;
    try {
      result = await templateUpdates.queryRecord({
        id: templateId
      });
    } catch (err) {
      // eslint-disable-next-line
      errorReports.send(Error(`${PREFIX} findRecordForTemplate: ${err}`));
      // continue with failure
    }

    // remove unwanted keys from updates
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, template, ...updates } = result || {};
    setData(updates || null);
    setStatus('success');
  };

  // Trigger request
  useEffect(() => {
    if (templateId) {
      findRecordForTemplate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateId]);

  return payload;
}
