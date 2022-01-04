import inspectionTemplateUpdate from '../../models/inspections/templateUpdate';
import unpublishedTemplateUpdate from '../../models/inspections/unpublishedTemplateUpdate';
import uuid from '../../utils/uuidv4'; // eslint-disable-line
import db from './init';

const PREFIX = 'common: services: indexedDB:  inspectionTemplateUpdates:';

// add templateUpdates data to indexed db for inspection
const createRecord = async (
  propertyId: string,
  inspectionId: string,
  template: inspectionTemplateUpdate
): Promise<any> => {
  const templateUpdatesData = {
    id: uuid(20),
    inspection: inspectionId,
    property: propertyId,
    template
  };

  try {
    const savedtemplateUpdates = await db.inspectionTemplateUpdates.add(
      templateUpdatesData
    );
    return savedtemplateUpdates;
  } catch (err) {
    throw Error(`${PREFIX} createRecord: ${err}`);
  }
};

interface QueryRecordParams {
  inspection: string;
}

// Query for a record
const queryRecord = (
  query: QueryRecordParams
): Promise<unpublishedTemplateUpdate> => {
  try {
    return db.inspectionTemplateUpdates.get(query);
  } catch (err) {
    throw Error(`${PREFIX} queryRecord: ${err}`);
  }
};

// Will return number
// dexie table.update returns 1 if record upate suuccessfully , otherwise 0
// https://dexie.org/docs/Table/Table.update()#return-value
const updateRecordTemplate = async (
  id: string,
  data: inspectionTemplateUpdate
): Promise<inspectionTemplateUpdate> => {
  try {
    const result = await db.inspectionTemplateUpdates.update(id, {
      template: data
    });

    if (result !== 1) {
      throw Error(`${PREFIX} updateRecordTemplate: failed to update record`);
    }

    return data;
  } catch (err) {
    throw Error(`${PREFIX} updateRecordTemplate: ${err}`);
  }
};

// Updates existing record otherwise
// creates a new record
const upsertRecord = async (
  propertyId: string,
  inspectionId: string,
  data: inspectionTemplateUpdate
): Promise<inspectionTemplateUpdate> => {
  let current = null;
  try {
    current = await queryRecord({
      inspection: inspectionId
    });
  } catch (err) {
    throw Error(`${PREFIX} upsertRecord: query record failed: ${err}`);
  }

  if (current) {
    try {
      return updateRecordTemplate(current.id, data);
    } catch (err) {
      throw Error(`${PREFIX} upsertRecord: update record failed: ${err}`);
    }
  }

  try {
    return createRecord(propertyId, inspectionId, data);
  } catch (err) {
    throw Error(`${PREFIX} upsertRecord: create record failed: ${err}`);
  }
};

// Delete record associated with
// an inspection if it exists
const deleteRecordForInspection = async (
  inspectionId: string
): Promise<void> => {
  let current = null;
  try {
    current = await queryRecord({
      inspection: inspectionId
    });
  } catch (err) {
    throw Error(
      `${PREFIX} deleteRecordForInspection: query record failed: ${err}`
    );
  }

  // Do nothing if record
  // cannot be found for inspection
  if (!current) return;

  try {
    await db.inspectionTemplateUpdates.delete(current.id);
  } catch (err) {
    throw Error(`${PREFIX} deleteRecordForInspection: ${err}`);
  }
};

export default {
  createRecord,
  queryRecord,
  upsertRecord,
  updateRecordTemplate,
  deleteRecordForInspection
};
