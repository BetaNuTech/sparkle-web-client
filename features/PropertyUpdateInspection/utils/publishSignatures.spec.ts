import sinon from 'sinon';
import util from './publishSignatures';
import { unpublishedSignatureEntry } from '../../../__mocks__/inspections';
import deepClone from '../../../__tests__/helpers/deepClone';
import unpublishedSignatureModel from '../../../common/models/inspections/templateItemUnpublishedSignature';
import signatureDb from '../../../common/services/indexedDB/inspectionSignature';
import { StorageResult } from '../../../common/hooks/useStorage';

const INSPECTION_ID = '123';
const ITEM_ID = 'abc';
const SIGNATURE_ONE = Object.freeze({
  ...unpublishedSignatureEntry,
  id: '456',
  createdAt: 1,
  inspection: INSPECTION_ID,
  item: ITEM_ID
} as unpublishedSignatureModel);
const SIGNATURE_TWO = Object.freeze({
  ...unpublishedSignatureEntry,
  id: '789',
  createdAt: 2,
  inspection: INSPECTION_ID,
  item: ITEM_ID
} as unpublishedSignatureModel);

describe('Unit | Features | Property Update Inspection | Utils | Publish Signatures', () => {
  afterEach(() => sinon.restore());

  test('it uploads all signatures data to storage', async () => {
    const signatures = [SIGNATURE_ONE, SIGNATURE_TWO].map(
      (sig) => deepClone(sig) as unpublishedSignatureModel
    );
    const expected = signatures.map(
      ({ inspection, item, createdAt }) =>
        `inspectionItemImages/${inspection}/${item}/${createdAt}.png`
    );
    const onUpload = (dest) =>
      Promise.resolve({ fileUrl: dest } as StorageResult);

    const { successful } = await util.uploadSignatures(
      INSPECTION_ID,
      signatures,
      onUpload,
      0,
      sinon.spy()
    );

    const actual = successful.map(
      ({ signatureDownloadURL }) => signatureDownloadURL
    );
    expect(actual).toEqual(expected);
  });

  test('it collects errors for any failed uploads', async () => {
    const signatures = [SIGNATURE_ONE, SIGNATURE_TWO].map(
      (sig) => deepClone(sig) as unpublishedSignatureModel
    );
    const expected = [
      // eslint-disable-next-line max-len
      `Error: features: PropertyUpdateInspection: utils: publishSignatures: upload: failed to upload signature for inspection "${INSPECTION_ID}" item "${ITEM_ID}": Error: failed`
    ];

    let invoked = 0;
    const onUpload = (dest) => {
      invoked += 1;

      if (invoked > 1) {
        return Promise.reject(Error('failed'));
      }

      return Promise.resolve({ fileUrl: dest } as StorageResult);
    };

    const { errors } = await util.uploadSignatures(
      INSPECTION_ID,
      signatures,
      onUpload,
      0,
      sinon.spy()
    );

    const actual = errors.map((err) => err.toString());
    expect(actual).toEqual(expected);
  });

  test('it increments the total upload size of signatures as they are processed', async () => {
    const expected = 3;
    const signatures = [SIGNATURE_ONE, SIGNATURE_TWO].map(
      (sig, i) => ({ ...sig, size: i + 1 } as unpublishedSignatureModel)
    );

    // Succeed one and file one
    let invoked = 0;
    const onUpload = (dest) => {
      invoked += 1;

      if (invoked > 1) {
        return Promise.reject(Error('failed'));
      }

      return Promise.resolve({ fileUrl: dest } as StorageResult);
    };

    let actual = 0;
    await util.uploadSignatures(
      INSPECTION_ID,
      signatures,
      onUpload,
      0,
      (uploadedSize) => {
        actual = uploadedSize;
      }
    );

    expect(actual).toEqual(expected);
  });

  test('it removes all signatures previously uploaded to storage from local database', async () => {
    const signatures = [SIGNATURE_ONE, SIGNATURE_TWO].map((sig) => {
      const clone = deepClone(sig) as unpublishedSignatureModel;
      clone.signatureDownloadURL = `inspectionItemImages/${sig.inspection}/${sig.item}/${sig.createdAt}.png`;
      return clone;
    });
    const expected = signatures.map(({ id }) => id);

    // Stub delete
    const deleteRecord = sinon
      .stub(signatureDb, 'deleteMultipleRecords')
      .resolves();
    await util.removePublished(signatures);

    const actual = [];
    const firstArg = (deleteRecord.firstCall || { args: [['']] }).args[0][0];
    const secondArg = (deleteRecord.secondCall || { args: [['']] }).args[0][0];
    actual.push(firstArg, secondArg);
    expect(actual).toEqual(expected);
  });

  test('it collects errors for any failed signature removals', async () => {
    const signatures = [SIGNATURE_ONE, SIGNATURE_TWO].map((sig) => {
      const clone = deepClone(sig) as unpublishedSignatureModel;
      clone.signatureDownloadURL = `inspectionItemImages/${sig.inspection}/${sig.item}/${sig.createdAt}.png`;
      return clone;
    });
    const badSig = signatures[1];
    const expected = [
      // eslint-disable-next-line max-len
      `Error: features: PropertyUpdateInspection: utils: publishSignatures: removePublished: failed to remove signature: "${badSig.id}" for inspection: "${badSig.inspection}" item: "${badSig.item}": Error: fail`
    ];

    // Stub delete
    sinon
      .stub(signatureDb, 'deleteMultipleRecords')
      .onCall(0)
      .resolves()
      .onCall(1)
      .rejects(Error('fail'));
    const { errors } = await util.removePublished(signatures);

    const actual = errors.map((err) => err.toString());
    expect(actual).toEqual(expected);
  });
});
