import sinon from 'sinon';
import util from './publishPhotos';
import { unpublishedPhotoDataEntry } from '../../../__mocks__/inspections';
import deepClone from '../../../__tests__/helpers/deepClone';
import unpublishedPhotoModel from '../../../common/models/inspections/templateItemUnpublishedPhotoData';
import photosDb from '../../../common/services/indexedDB/inspectionItemPhotosData';
import inspectionApi from '../../../common/services/api/inspections';

const INSPECTION_ID = '123';
const ITEM_ID = 'abc';
const PHOTO_ONE = Object.freeze({
  ...unpublishedPhotoDataEntry,
  id: '456',
  createdAt: 1,
  inspection: INSPECTION_ID,
  item: ITEM_ID
} as unpublishedPhotoModel);

const PHOTO_TWO = Object.freeze({
  ...unpublishedPhotoDataEntry,
  id: '789',
  createdAt: 2,
  inspection: INSPECTION_ID,
  item: ITEM_ID
} as unpublishedPhotoModel);

const INSP_UPLOAD_RESULT_PHOTO_ONE = {
  id: '123-abc',
  downloadURL: 'https://dummyimage.com/600x400/000/fff'
};
const INSP_UPLOAD_RESULT_PHOTO_TWO = {
  id: '456-abc',
  downloadURL: 'https://dummyimage.com/600x400/000/fff'
};

describe('Unit | Features | Property Update Inspection | Utils | Publish Photos', () => {
  afterEach(() => sinon.restore());

  test('it uploads all photos data to api', async () => {
    const photos = [PHOTO_ONE, PHOTO_TWO].map(
      (photo) => deepClone(photo) as unpublishedPhotoModel
    );
    const expected = [
      INSP_UPLOAD_RESULT_PHOTO_ONE.downloadURL,
      INSP_UPLOAD_RESULT_PHOTO_TWO.downloadURL
    ];

    sinon
      .stub(inspectionApi, 'uploadPhotoData')
      .onCall(0)
      .resolves(INSP_UPLOAD_RESULT_PHOTO_ONE)
      .onCall(1)
      .resolves(INSP_UPLOAD_RESULT_PHOTO_TWO);

    const { successful } = await util.upload(INSPECTION_ID, photos);

    const actual = successful.map(({ downloadURL }) => downloadURL);

    expect(actual).toEqual(expected);
  });

  test('it collects errors for any failed uploads', async () => {
    const photos = [PHOTO_ONE, PHOTO_TWO].map(
      (photo) => deepClone(photo) as unpublishedPhotoModel
    );
    const expected = [
      // eslint-disable-next-line max-len
      `Error: features: PropertyUpdateInspection: utils: publishPhotos: upload: failed to upload photo for inspection "${INSPECTION_ID}" item "${ITEM_ID}": Error: failed`
    ];

    sinon
      .stub(inspectionApi, 'uploadPhotoData')
      .onCall(0)
      .resolves(INSP_UPLOAD_RESULT_PHOTO_ONE)
      .onCall(1)
      .rejects(Error('failed'));

    const { errors } = await util.upload(INSPECTION_ID, photos);

    const actual = errors.map((err) => err.toString());
    expect(actual).toEqual(expected);
  });

  test('it removes all photos previously uploaded to api from local database', async () => {
    const photos = [PHOTO_ONE, PHOTO_TWO].map(
      (photo) => deepClone(photo) as unpublishedPhotoModel
    );
    const expected = photos.map(({ id }) => id);

    // Stub delete
    const deleteRecord = sinon.stub(photosDb, 'deleteRecord').resolves();
    await util.removePublished(photos);

    const actual = [];
    const firstArg = (deleteRecord.firstCall || { args: [['']] }).args[0];
    const secondArg = (deleteRecord.secondCall || { args: [['']] }).args[0];
    actual.push(firstArg, secondArg);
    expect(actual).toEqual(expected);
  });

  test('it collects errors for any failed photo removals', async () => {
    const photos = [PHOTO_ONE, PHOTO_TWO].map(
      (photo) => deepClone(photo) as unpublishedPhotoModel
    );
    const badPhoto = photos[1];
    const expected = [
      // eslint-disable-next-line max-len
      `Error: features: PropertyUpdateInspection: utils: publishPhotos: removePublished: failed to remove photo: "${badPhoto.id}" for inspection: "${badPhoto.inspection}" item: "${badPhoto.item}": Error: fail`
    ];

    // Stub delete
    sinon
      .stub(photosDb, 'deleteRecord')
      .onCall(0)
      .resolves()
      .onCall(1)
      .rejects(Error('fail'));
    const { errors } = await util.removePublished(photos);

    const actual = errors.map((err) => err.toString());
    expect(actual).toEqual(expected);
  });
});
