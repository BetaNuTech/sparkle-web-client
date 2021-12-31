import sinon from 'sinon';
import { act, waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import storageApi from '../../../common/services/storage';
import errorReports from '../../../common/services/api/errorReports';
import useInspectionUpload from './useInspectionUpload';

describe('Unit | Features | Inspection Edit | Hooks | Use Inspection Upload', () => {
  afterEach(() => sinon.restore());

  test('should show send notification, send error to backend on upload storage fails', async () => {
    const expected = true;
    const sendNotification = sinon.spy();
    const changeItemsSignature = sinon.spy();
    const removeUnpublishedInspectionItemSignature = sinon.spy();

    const signatureData = {
      id: 'signature-1',
      inspection: 'inspection-1',
      item: 'item-1',
      signature: 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='
    };

    const signatureUploadData = new Map();
    signatureUploadData.set('item-1', [signatureData]);

    // Creates spy for method in storageApi
    sinon.stub(storageApi, 'createBase64UploadTask').throws(Error('fail'));
    const sendReport = sinon.stub(errorReports, 'send').resolves(true);

    await act(async () => {
      const { result } = renderHook(() =>
        useInspectionUpload(
          'inspection-1',
          sendNotification,
          changeItemsSignature,
          removeUnpublishedInspectionItemSignature
        )
      );
      result.current.onInspectionUpload(signatureUploadData, {});
    });

    await waitFor(() => sendReport.called);

    const actual = sendReport.called;
    expect(actual).toEqual(expected);

    // Send notification check
    const resultNotification = sendNotification.firstCall || { args: [] };
    const actualNotification = resultNotification.args[1]
      ? resultNotification.args[1].type
      : '';
    expect(actualNotification).toEqual('error');
  });
});
