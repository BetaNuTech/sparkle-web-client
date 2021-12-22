import moment from 'moment';
import unpublishedPhotoDataModal from '../../models/inspections/templateItemUnpublishedPhotoData';
import uuid from '../../utils/uuidv4'; // eslint-disable-line
import db from './init';

const PREFIX = 'common: services: indexedDB:  inspectionItemPhotosData:';

// add photos data to indexed db for inspection item
export const createMultipleRecords = async (
  files: Array<string>,
  itemId: string,
  inspectionId: string
): Promise<any> => {
  const photosData = files.map((file) => ({
    id: uuid(20),
    createdAt: moment().unix(),
    caption: '',
    inspection: inspectionId,
    item: itemId,
    photoData: file
  }));

  try {
    const savedItemPhotos = await db.inspectionItemPhotos.bulkAdd(photosData);
    return savedItemPhotos;
  } catch (err) {
    throw Error(`${PREFIX} createMultipleRecords: ${err}`);
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

export default {
  queryItemRecords,
  queryInspectionRecords,
  createMultipleRecords
};
