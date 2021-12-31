import sinon from 'sinon';
import { renderHook } from '@testing-library/react-hooks';
import { act } from '@testing-library/react';
import currentUser from '../../../common/utils/currentUser';
import storageApi from '../../../common/services/storage';
import useSignatureUpload from './useSignatureUpload';

describe('Unit | Features | Inspection Edit | Hooks | Use Signature Upload', () => {
  afterEach(() => sinon.restore());

  test('should set in state upload storage fails', async () => {
    const expected =
      'Some signatures failed to publish, please check your internet connection and try again';

    const signatureData = {
      id: 'signature-1',
      inspection: 'inspection-1',
      item: 'item-1',
      signature: 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='
    };

    sinon.stub(currentUser, 'getIdToken').callsFake(() => true);

    const signatureUploadData = new Map();
    signatureUploadData.set('item-1', [signatureData]);

    sinon.stub(storageApi, 'createBase64UploadTask').throws(Error('fail'));

    const { result } = renderHook(() =>
      useSignatureUpload('inspection-1')
    );

    await act(async () => {
      result.current.onSignatureUpload(signatureUploadData);
    });

    expect(result.current.error).toEqual(expected);
  });
});
