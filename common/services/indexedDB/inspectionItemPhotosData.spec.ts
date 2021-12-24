import sinon from 'sinon';
import inspectionItemPhotosDataService from './inspectionItemPhotosData';

describe('Unit | Services | indexedDB | Inspection Item Photos Data', () => {
  afterEach(() => sinon.restore());

  test('should call find record and return photos data for item ', async () => {
    let result = null;
    try {
      // eslint-disable-next-line import/no-named-as-default-member
      result = await inspectionItemPhotosDataService.queryInspectionRecords(
        'inspection-1'
      );
    } catch (err) {
      result = err;
    }
    expect(result).toEqual([]);
  });

  test('should call method to add inspection item photos and return last inserted id', async () => {
    const files = [
      'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
      'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='
    ];

    let result = null;
    try {
      // eslint-disable-next-line import/no-named-as-default-member
      result = await inspectionItemPhotosDataService.createMultipleRecords(
        files,
        'item-1',
        'inspection-1'
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
      result = await inspectionItemPhotosDataService.queryInspectionRecords(
        'inspection-1'
      );
    } catch (err) {
      result = err;
    }
    expect(result).toHaveLength(2);
    result.forEach((item) => {
      expect(item.inspection).toEqual('inspection-1');
      expect(item.item).toEqual('item-1');
    });
  });

  test('should update photo record in indexed db', async () => {
    const expected = 'test caption';
    let result = null;
    let idForUpdate = null;
    try {
      // eslint-disable-next-line import/no-named-as-default-member
      result = await inspectionItemPhotosDataService.queryInspectionRecords(
        'inspection-1'
      );
    } catch (err) {
      result = err;
    }
    idForUpdate = result[0].id;
    // eslint-disable-next-line import/no-named-as-default-member
    await inspectionItemPhotosDataService.updateRecord(idForUpdate, {
      caption: expected
    });

    try {
      // eslint-disable-next-line import/no-named-as-default-member
      result = await inspectionItemPhotosDataService.queryInspectionRecords(
        'inspection-1'
      );
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
      result = await inspectionItemPhotosDataService.queryInspectionRecords(
        'inspection-1'
      );
    } catch (err) {
      result = err;
    }
    photoIdFordelete = result[0].id;

    // eslint-disable-next-line import/no-named-as-default-member
    await inspectionItemPhotosDataService.deleteRecord(photoIdFordelete);

    try {
      // eslint-disable-next-line import/no-named-as-default-member
      result = await inspectionItemPhotosDataService.queryInspectionRecords(
        'inspection-1'
      );
    } catch (err) {
      result = err;
    }
    expect(result).toHaveLength(1);
    expect(result.id).not.toEqual(photoIdFordelete);
  });
});
