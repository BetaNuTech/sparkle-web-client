import sinon from 'sinon';
import util from './publishPhotos';
import { unpublishedPhotoDataEntry } from '../../../__mocks__/deficientItems';
import DeficientItemLocalPhotos from '../../../common/models/deficientItems/unpublishedPhotos';
import photosDb from '../../../common/services/indexedDB/deficientItemPhotos';
import deficiencyApi from '../../../common/services/api/deficientItems';
import BaseError from '../../../common/models/errors/baseError';

const DEFICIENCY_ID = 'deficiency-1';
const PHOTO_ONE = Object.freeze({
  ...unpublishedPhotoDataEntry,
  id: '456',
  createdAt: 1,
  startDate: 1,
  deficiency: DEFICIENCY_ID
} as DeficientItemLocalPhotos);

const PHOTO_TWO = Object.freeze({
  ...unpublishedPhotoDataEntry,
  id: '789',
  createdAt: 2,
  startDate: 1,
  deficiency: DEFICIENCY_ID
} as DeficientItemLocalPhotos);

const DEFICIENCY_UPLOAD_RESULT_PHOTO_ONE = {
  id: '123-abc',
  downloadURL: 'https://dummyimage.com/600x400/000/fff'
};
const DEFICIENCY_UPLOAD_RESULT_PHOTO_TWO = {
  id: '456-abc',
  downloadURL: 'https://dummyimage.com/600x400/000/fff'
};

describe('Unit | Features | Deficient Item Edit | Utils | Publish Photos', () => {
  afterEach(() => sinon.restore());

  test('it uploads all photos data to api', async () => {
    const photos = [PHOTO_ONE, PHOTO_TWO].map(
      (photo) => ({ ...photo } as DeficientItemLocalPhotos)
    );
    const expected = [
      DEFICIENCY_UPLOAD_RESULT_PHOTO_ONE.downloadURL,
      DEFICIENCY_UPLOAD_RESULT_PHOTO_TWO.downloadURL
    ];

    sinon
      .stub(deficiencyApi, 'uploadPhoto')
      .onCall(0)
      .resolves(DEFICIENCY_UPLOAD_RESULT_PHOTO_ONE)
      .onCall(1)
      .resolves(DEFICIENCY_UPLOAD_RESULT_PHOTO_TWO);

    const { successful } = await util.uploadPhotos(
      DEFICIENCY_ID,
      photos,
      0,
      sinon.spy()
    );

    const actual = successful.map(({ downloadURL }) => downloadURL);

    expect(actual).toEqual(expected);
  });

  test('it collects errors for any failed uploads', async () => {
    const photos = [PHOTO_ONE, PHOTO_TWO].map(
      (photo) => ({ ...photo } as DeficientItemLocalPhotos)
    );

    const mockError = {
      title: 'upload error title',
      detail: 'upload error detail'
    };

    const expected = [
      // eslint-disable-next-line max-len
      `Error: features: DeficientItemEdit: utils: publishPhotos: upload: failed to upload photo for deficiency "${DEFICIENCY_ID}": failed: ${mockError.title},${mockError.detail}`
    ];

    const error = new BaseError('failed');
    error.addErrors([mockError]);

    sinon
      .stub(deficiencyApi, 'uploadPhoto')
      .onCall(0)
      .resolves(DEFICIENCY_UPLOAD_RESULT_PHOTO_ONE)
      .onCall(1)
      .rejects(error);

    const { errors } = await util.uploadPhotos(
      DEFICIENCY_ID,
      photos,
      0,
      sinon.spy()
    );

    const actual = errors.map((err) => err.toString());
    expect(actual).toEqual(expected);
  });

  test('it increments the total upload size of photos as they are processed', async () => {
    const expected = 3;
    const photos = [PHOTO_ONE, PHOTO_TWO].map(
      (photo, i) => ({ ...photo, size: i + 1 } as DeficientItemLocalPhotos)
    );

    let actual = 0;
    sinon
      .stub(deficiencyApi, 'uploadPhoto')
      .onCall(0)
      .resolves(DEFICIENCY_UPLOAD_RESULT_PHOTO_ONE)
      .onCall(1)
      .rejects(Error('failed'));

    await util.uploadPhotos(DEFICIENCY_ID, photos, 0, (uploadedSize) => {
      actual = uploadedSize;
    });

    expect(actual).toEqual(expected);
  });

  test('it removes all successfully uploaded photos from the local database', async () => {
    const photos = [PHOTO_ONE, PHOTO_TWO].map(
      (photo) => ({ ...photo } as DeficientItemLocalPhotos)
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
      (photo) => ({ ...photo } as DeficientItemLocalPhotos)
    );
    const badPhoto = photos[1];
    const expected = [
      // eslint-disable-next-line max-len
      `Error: features: DeficientItemEdit: utils: publishPhotos: removePublished: failed to remove photo: "${badPhoto.id}" for deficiency: "${badPhoto.deficiency}": Error: fail`
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
