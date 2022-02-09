import moment from 'moment';
import sinon from 'sinon';
import deficientItemPhotosService from './deficientItemPhotos';

describe('Unit | Services | indexedDB | Deficient Item Photos', () => {
  afterEach(() => sinon.restore());

  test('should call find record and return photos data for deficiency ', async () => {
    let result = null;
    try {
      // eslint-disable-next-line import/no-named-as-default-member
      result = await deficientItemPhotosService.query('deficiency-1');
    } catch (err) {
      result = err;
    }
    expect(result).toEqual([]);
  });

  test('should call method to add deficiency photos and return last inserted id', async () => {
    const file =
      'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

    let result = null;
    try {
      // eslint-disable-next-line import/no-named-as-default-member
      result = await deficientItemPhotosService.createRecord(
        file,
        100,
        'item-1',
        'inspection-1',
        'property-1',
        'deficiency-1',
        moment().unix()
      );
    } catch (err) {
      result = err;
    }

    expect(result).toBeTruthy();
    expect(result).toHaveLength(20);
  });

  test('should return photos data added in indexed db', async () => {
    let result = null;
    try {
      // eslint-disable-next-line import/no-named-as-default-member
      result = await deficientItemPhotosService.query('deficiency-1');
    } catch (err) {
      result = err;
    }
    expect(result).toHaveLength(1);
    result.forEach((item) => {
      expect(item.deficiency).toEqual('deficiency-1');
      expect(item.item).toEqual('item-1');
    });
  });

  test('should update photo record in indexed db', async () => {
    const expected = 'test caption';
    let result = null;
    let idForUpdate = null;
    try {
      // eslint-disable-next-line import/no-named-as-default-member
      result = await deficientItemPhotosService.query('deficiency-1');
    } catch (err) {
      result = err;
    }
    idForUpdate = result[0].id;
    // eslint-disable-next-line import/no-named-as-default-member
    await deficientItemPhotosService.updateRecord(idForUpdate, {
      caption: expected
    });

    try {
      // eslint-disable-next-line import/no-named-as-default-member
      result = await deficientItemPhotosService.query('deficiency-1');
    } catch (err) {
      result = err;
    }
    expect(result[0].caption).toBe(expected);
  });

  test('should delete photo data previously added in indexed db', async () => {
    let result = null;
    let photoIdFordelete = '';
    try {
      // eslint-disable-next-line import/no-named-as-default-member
      result = await deficientItemPhotosService.query('deficiency-1');
    } catch (err) {
      result = err;
    }
    photoIdFordelete = result[0].id;

    // eslint-disable-next-line import/no-named-as-default-member
    await deficientItemPhotosService.deleteRecord(photoIdFordelete);

    try {
      // eslint-disable-next-line import/no-named-as-default-member
      result = await deficientItemPhotosService.query('deficiency-1');
    } catch (err) {
      result = err;
    }
    expect(result).toHaveLength(0);
    expect(result.id).not.toEqual(photoIdFordelete);
  });
});
