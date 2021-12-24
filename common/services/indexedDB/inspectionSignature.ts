import moment from 'moment';
import unpublishedSignatureModal from '../../models/inspections/templateItemUnpublishedSignature';
import uuid from '../../utils/uuidv4'; // eslint-disable-line
import db from './init';

const PREFIX = 'common: services: indexedDB:  inspectionSignature:';

// add signature data to indexed db for inspection
export const createRecord = async (
  file: string,
  itemId: string,
  inspectionId: string
): Promise<any> => {
  const signatureData = {
    id: uuid(20),
    createdAt: moment().unix(),
    inspection: inspectionId,
    item: itemId,
    signature: file
  };

  try {
    const savedSignature = await db.inspectionSignature.add(signatureData);
    return savedSignature;
  } catch (err) {
    throw Error(`${PREFIX} createRecord: ${err}`);
  }
};

export const queryRecords = async (
  inspectionId: string
): Promise<unpublishedSignatureModal[]> => {
  try {
    const signature = await db.inspectionSignature
      .where('inspection')
      .equals(inspectionId)
      .sortBy('createdAt');

    return signature;
  } catch (err) {
    throw Error(`${PREFIX} queryRecords: ${err}`);
  }
};

// Will return number
// dexie table.update returns 1 if record upate suuccessfully , otherwise 0
// https://dexie.org/docs/Table/Table.update()#return-value
export const updateRecord = async (
  signatureId: string,
  signatureData: Record<string, string>
): Promise<number> => {
  try {
    const result = await db.inspectionSignature.update(
      signatureId,
      signatureData
    );

    if (result === 1) {
      return result;
    }
    throw Error(`${PREFIX} updateRecord: Data not updated in indexedDB`);
  } catch (err) {
    throw Error(`${PREFIX} updateRecord: ${err}`);
  }
};

export default {
  createRecord,
  queryRecords,
  updateRecord
};
