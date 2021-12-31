import sinon from 'sinon';
import inspectionSignature from './inspectionSignature';

describe('Unit | Services | indexedDB | Inspection Signature', () => {
  afterEach(() => sinon.restore());

  test('should call get and return signature data for inspection from indexedDB', async () => {
    let result = null;
    try {
      // eslint-disable-next-line import/no-named-as-default-member
      result = await inspectionSignature.queryRecords('inspection-1');
    } catch (err) {
      result = err;
    }
    expect(result).toEqual([]);
  });

  test('should add signature data for inspection in indexedDB', async () => {
    const file =
      'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

    let result = null;
    try {
      // eslint-disable-next-line import/no-named-as-default-member
      result = await inspectionSignature.createRecord(
        file,
        'item-1',
        'inspection-1'
      );
    } catch (err) {
      result = err;
    }

    expect(result).toBeTruthy();
    expect(result).toHaveLength(20);
  });

  test('should return signature data for inspection added in indexed db', async () => {
    let result = null;
    try {
      // eslint-disable-next-line import/no-named-as-default-member
      result = await inspectionSignature.queryRecords('inspection-1');
    } catch (err) {
      result = err;
    }

    expect(result).toHaveLength(1);

    expect(result[0].inspection).toEqual('inspection-1');
    expect(result[0].item).toEqual('item-1');
  });

  test('should update signature data', async () => {
    const file = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
    let result = null;
    try {
      // eslint-disable-next-line import/no-named-as-default-member
      result = await inspectionSignature.queryRecords('inspection-1');
    } catch (err) {
      result = err;
    }
    expect(result.signature).not.toEqual(file);
    // eslint-disable-next-line import/no-named-as-default-member
    await inspectionSignature.updateRecord(result[0].id, { signature: file });

    try {
      // eslint-disable-next-line import/no-named-as-default-member
      result = await inspectionSignature.queryRecords('inspection-1');
    } catch (err) {
      result = err;
    }
    expect(result).toHaveLength(1);

    expect(result[0].inspection).toEqual('inspection-1');
    expect(result[0].item).toEqual('item-1');
    expect(result[0].signature).toEqual(file);
  });

  test('should delete signatures data', async () => {
    let result = null;
    try {
      // eslint-disable-next-line import/no-named-as-default-member
      result = await inspectionSignature.queryRecords('inspection-1');
    } catch (err) {
      result = err;
    }
    const ids = result.map((item) => item.id);
    // eslint-disable-next-line import/no-named-as-default-member
    await inspectionSignature.deleteMultipleRecords(ids);

    try {
      // eslint-disable-next-line import/no-named-as-default-member
      result = await inspectionSignature.queryRecords('inspection-1');
    } catch (err) {
      result = err;
    }
    expect(result).toHaveLength(0);
  });
});
