import util from './publishSignatures';
import { unpublishedSignatureEntry } from '../../../__mocks__/inspections';
import deepClone from '../../../__tests__/helpers/deepClone';
import unpublishedSignatureModel from '../../../common/models/inspections/templateItemUnpublishedSignature';
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

    const { successful } = await util.upload(
      INSPECTION_ID,
      signatures,
      onUpload
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

    const { errors } = await util.upload(INSPECTION_ID, signatures, onUpload);

    const actual = errors.map((err) => err.toString());
    expect(actual).toEqual(expected);
  });
});
