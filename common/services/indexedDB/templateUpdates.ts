import TemplateModal from '../../models/template';
import db from './init';

const PREFIX = 'common: services: indexedDB:  templateUpdate:';

interface QueryRecordParams {
  id: string;
}

// Query for a template record
const queryRecord = (query: QueryRecordParams): Promise<TemplateModal> => {
  try {
    return db.templateUpdates.get(query);
  } catch (err) {
    throw Error(`${PREFIX} queryRecord: ${err}`);
  }
};

export default {
  queryRecord
};
