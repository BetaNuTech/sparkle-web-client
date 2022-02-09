import moment from 'moment';
import DeficientItemLocalPhotos from '../../models/deficientItems/unpublishedPhotos';
import uuid from '../../utils/uuidv4'; // eslint-disable-line
import db from './init';

const PREFIX = 'common: services: indexedDB:  deficientItemPhotos:';

// add photos data to indexed db for deficiency
export const createRecord = async (
  file: string,
  size: number,
  itemId: string,
  inspectionId: string,
  propertyId: string,
  deficiencyId: string,
  startDate: number
): Promise<any> => {
  const photosData = {
    id: uuid(20),
    createdAt: moment().unix(),
    caption: '',
    inspection: inspectionId,
    item: itemId,
    deficiency: deficiencyId,
    photoData: file,
    property: propertyId,
    startDate,
    size
  };

  try {
    const savedPhotos = await db.deficientItemPhotos.add(photosData);
    return savedPhotos;
  } catch (err) {
    throw Error(`${PREFIX} createRecord: ${err}`);
  }
};

// get photos data from indexed db for deficiency
export const query = async (
  deficiency: string
): Promise<DeficientItemLocalPhotos[]> => {
  try {
    const deficiencyPhotos = await db.deficientItemPhotos
      .where('deficiency')
      .equals(deficiency)
      .sortBy('createdAt');
    return deficiencyPhotos;
  } catch (err) {
    throw Error(`${PREFIX} query: ${err}`);
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
    const result = await db.deficientItemPhotos.update(
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
    await db.deficientItemPhotos.delete(recordId);
  } catch (err) {
    throw Error(`${PREFIX} deleteRecord: ${err}`);
  }
};

export default {
  query,
  createRecord,
  updateRecord,
  deleteRecord
};
