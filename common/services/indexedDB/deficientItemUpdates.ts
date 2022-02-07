import DeficientItemModel from '../../models/deficientItem';
import DeficientItemLocalUpdates from '../../models/deficientItems/unpublishedUpdates';
import uuid from '../../utils/uuidv4'; // eslint-disable-line
import db from './init';

const PREFIX = 'common: services: indexedDB:  deficientItemUpdates:';

// add deficient item updates to indexed db
const createRecord = async (
  propertyId: string,
  deficiencyId: string,
  inspectionId: string,
  updates: DeficientItemModel
): Promise<any> => {
  const updatesData = {
    id: uuid(20),
    deficiency: deficiencyId,
    property: propertyId,
    inspection: inspectionId,
    ...updates
  } as DeficientItemLocalUpdates;

  try {
    const savedTemplateUpdates = await db.deficientItemUpdates.add(updatesData);
    return savedTemplateUpdates;
  } catch (err) {
    throw Error(`${PREFIX} createRecord: ${err}`);
  }
};

interface QueryRecordParams {
  deficiency: string;
}

// Query for a record
const queryRecord = (
  query: QueryRecordParams
): Promise<DeficientItemLocalUpdates> => {
  try {
    return db.deficientItemUpdates.get(query);
  } catch (err) {
    throw Error(`${PREFIX} queryRecord: ${err}`);
  }
};

const updateRecord = async (
  id: string,
  data: DeficientItemModel
): Promise<DeficientItemModel> => {
  try {
    const result = await db.deficientItemUpdates.update(id, { ...data });

    if (result !== 1) {
      throw Error(`${PREFIX} updateRecord: failed to update record`);
    }

    return data;
  } catch (err) {
    throw Error(`${PREFIX} updateRecord: ${err}`);
  }
};

// Updates existing record otherwise
// creates a new record
const upsertRecord = async (
  propertyId: string,
  deficiencyId: string,
  inspectionId: string,
  data: DeficientItemModel
): Promise<DeficientItemModel> => {
  let current = null;
  try {
    current = await queryRecord({
      deficiency: deficiencyId
    });
  } catch (err) {
    throw Error(`${PREFIX} upsertRecord: query record failed: ${err}`);
  }

  if (current) {
    try {
      return updateRecord(current.id, data);
    } catch (err) {
      throw Error(`${PREFIX} upsertRecord: updateRecord record failed: ${err}`);
    }
  }

  try {
    return createRecord(propertyId, deficiencyId, inspectionId, data);
  } catch (err) {
    throw Error(`${PREFIX} upsertRecord: createRecord record failed: ${err}`);
  }
};

// Delete record associated with
// an deficiency if it exists
const deleteRecord = async (deficiencyId: string): Promise<void> => {
  let current = null;
  try {
    current = await queryRecord({
      deficiency: deficiencyId
    });
  } catch (err) {
    throw Error(`${PREFIX} deleteRecord: query record failed: ${err}`);
  }

  // Do nothing if record
  // cannot be found for deficiency
  if (!current) return;

  try {
    await db.deficientItemUpdates.delete(current.id);
  } catch (err) {
    throw Error(`${PREFIX} deleteRecord: ${err}`);
  }
};

export default {
  createRecord,
  queryRecord,
  upsertRecord,
  updateRecord,
  deleteRecord
};
