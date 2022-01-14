import moment from 'moment';
import unpublishedPhotoDataModal from '../../models/inspections/templateItemUnpublishedPhotoData';
import uuid from '../../utils/uuidv4'; // eslint-disable-line
import db from './init';

const PREFIX = 'common: services: indexedDB:  inspectionItemPhotosData:';

// add photos data to indexed db for inspection item
export const createRecord = async (
  file: string,
  size: number,
  itemId: string,
  inspectionId: string,
  propertyId: string
): Promise<any> => {
  const photosData = {
    id: uuid(20),
    createdAt: moment().unix(),
    caption: '',
    inspection: inspectionId,
    item: itemId,
    photoData: file,
    property: propertyId,
    size
  };

  try {
    const savedItemPhotos = await db.inspectionItemPhotos.add(photosData);
    return savedItemPhotos;
  } catch (err) {
    throw Error(`${PREFIX} createRecord: ${err}`);
  }
};

// get photos data to indexed db for inspection item
export const queryItemRecords = async (
  itemId: string
): Promise<unpublishedPhotoDataModal[]> => {
  try {
    const itemPhotos = await db.inspectionItemPhotos
      .where('item')
      .equals(itemId)
      .sortBy('createdAt');
    return itemPhotos;
  } catch (err) {
    throw Error(`${PREFIX} queryItemRecords: ${err}`);
  }
};

export const queryInspectionRecords = async (
  inspectionId: string
): Promise<unpublishedPhotoDataModal[]> => {
  try {
    const itemPhotos = await db.inspectionItemPhotos
      .where('inspection')
      .equals(inspectionId)
      .sortBy('createdAt');
    return itemPhotos;
  } catch (err) {
    throw Error(`${PREFIX} queryInspectionRecords: ${err}`);
  }
};

// Will return number
// dexie table.update returns 1 if record upate suuccessfully , otherwise 0
// https://dexie.org/docs/Table/Table.update()#return-value
export const updateRecord = async (
  unpublishedPhotoId: string,
  updates: Record<string, string>
): Promise<number> => {
  try {
    const result = await db.inspectionItemPhotos.update(
      unpublishedPhotoId,
      updates
    );
    if (result === 1) {
      return result;
    }
    throw Error(`${PREFIX} updateRecord: Data not updated in indexedDB`);
  } catch (err) {
    throw Error(`${PREFIX} updateRecord: ${err}`);
  }
};

export const deleteRecord = async (recordId: string): Promise<void> => {
  try {
    await db.inspectionItemPhotos.delete(recordId);
  } catch (err) {
    throw Error(`${PREFIX} deleteRecord: ${err}`);
  }
};

export default {
  queryItemRecords,
  queryInspectionRecords,
  createRecord,
  updateRecord,
  deleteRecord
};
