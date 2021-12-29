import inspectionTemplateUpdate from '../../models/inspections/templateUpdate';
import unpublishedTemplateUpdate from '../../models/inspections/unpublishedTemplateUpdate';
import uuid from '../../utils/uuidv4'; // eslint-disable-line
import db from './init';

const PREFIX = 'common: services: indexedDB:  inspectionTemplateUpdates:';

// add templateUpdates data to indexed db for inspection
export const createRecord = async (
  template: inspectionTemplateUpdate,
  propertyId: string,
  inspectionId: string
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

export const getRecord = async (
  inspectionId: string
): Promise<unpublishedTemplateUpdate> => {
  try {
    const templateUpdates = await db.inspectionTemplateUpdates.get({
      inspection: inspectionId
    });
    return templateUpdates;
  } catch (err) {
    throw Error(`${PREFIX} getRecord: ${err}`);
  }
};

// Will return number
// dexie table.update returns 1 if record upate suuccessfully , otherwise 0
// https://dexie.org/docs/Table/Table.update()#return-value
export const updateRecord = async (
  template: inspectionTemplateUpdate,
  templateId: string
): Promise<number> => {
  try {
    const result = await db.inspectionTemplateUpdates.update(templateId, {
      template
    });

    if (result === 1) {
      return result;
    }
    throw Error(`${PREFIX} updateRecord: Data not updated in indexedDB`);
  } catch (err) {
    throw Error(`${PREFIX} updateRecord: ${err}`);
  }
};

export const deleteRecord = async (templateUpdatesId: string): Promise<any> => {
  try {
    await db.inspectionTemplateUpdates.delete(templateUpdatesId);
  } catch (err) {
    throw Error(`${PREFIX} deleteRecord: ${err}`);
  }
};

export default {
  createRecord,
  getRecord,
  updateRecord,
  deleteRecord
};
