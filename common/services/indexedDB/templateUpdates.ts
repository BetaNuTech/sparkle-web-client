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

// add template updates to indexed db
const createRecord = async (
  templateId: string,
  updates: TemplateModal
): Promise<any> => {
  const updatesData = {
    id: templateId,
    ...updates
  } as TemplateModal;

  try {
    const savedTemplateUpdates = await db.templateUpdates.add(updatesData);
    return savedTemplateUpdates;
  } catch (err) {
    throw Error(`${PREFIX} createRecord: ${err}`);
  }
};

// Updates existing record otherwise
// creates a new record
const upsertRecord = async (
  templateId: string,
  data: TemplateModal
): Promise<TemplateModal> => {
  const updatesData = {
    id: templateId,
    ...data
  } as TemplateModal;
  try {
    const result = await db.templateUpdates.put(updatesData);
    if (!result) {
      throw Error(`${PREFIX} upsertRecord: failed to update record`);
    }
    return data;
  } catch (err) {
    throw Error(`${PREFIX} upsertRecord: ${err}`);
  }
};
// Delete record associated with
// an template if it exists
const deleteRecord = async (templateId: string): Promise<void> => {
  let current = null;
  try {
    current = await queryRecord({
      id: templateId
    });
  } catch (err) {
    throw Error(`${PREFIX} deleteRecord: query record failed: ${err}`);
  }

  // Do nothing if record
  // cannot be found for template
  if (!current) return;

  try {
    await db.templateUpdates.delete(current.id);
  } catch (err) {
    throw Error(`${PREFIX} deleteRecord: ${err}`);
  }
};

export default {
  createRecord,
  queryRecord,
  upsertRecord,
  deleteRecord
};
