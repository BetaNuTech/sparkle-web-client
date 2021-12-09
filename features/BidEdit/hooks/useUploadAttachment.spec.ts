import sinon from 'sinon';
import { renderHook } from '@testing-library/react-hooks';
import { act, waitFor } from '@testing-library/react';
import errorReports from '../../../common/services/api/errorReports';
import { openBid } from '../../../__mocks__/bids';
import storageApi from '../../../common/services/storage';
import bidsDb from '../../../common/services/firestore/bids';
import useUploadAttachment from './useUploadAttachment';
import stubFirestore from '../../../__tests__/helpers/stubFirestore';

describe('Unit | Features | Bid Edit | Hooks | Use Upload Attachment', () => {
  afterEach(() => sinon.restore());

  test('should show send notification, send error to backend on upload storage fails', async () => {
    const expected = true;
    const expectedNotification = 'error';
    const sendNotification = sinon.spy();
    const firestore = stubFirestore(); // eslint-disable-line

    sinon.stub(storageApi, 'createUploadTask').throws(Error('fail'));
    const sendReport = sinon.stub(errorReports, 'send').resolves(true);

    const { result } = renderHook(() =>
      useUploadAttachment(firestore, openBid, sendNotification)
    );

    await act(async () => {
      result.current.onUploadFile(
        {
          target: {
            files: [new File(['(⌐□_□)'], 'test.png', { type: 'image/png' })]
          }
        },
        'property-1',
        'job-1',
        'bid-1'
      );
    });

    await waitFor(() => sendReport.called);

    // Error send check
    const actual = sendReport.called;
    expect(actual).toEqual(expected);

    // Send notification check
    const resultNotification = sendNotification.firstCall || { args: [] };
    const actualNotification = resultNotification.args[1]
      ? resultNotification.args[1].type
      : '';
    expect(actualNotification).toEqual(expectedNotification);
  });

  test('should show send notification, send error to backend on bid field update firestore fails', async () => {
    const expected = true;
    const expectedNotification = 'error';
    const sendNotification = sinon.spy();
    const firestore = stubFirestore(); // eslint-disable-line

    // Resolves true
    sinon.stub(storageApi, 'createUploadTask').returns({
      snapshot: { ref: 'test' },
      on(evt, onStart, onError, onComplete) {
        onComplete();
      }
    });

    const sendReport = sinon.stub(errorReports, 'send').resolves(true);
    sinon.stub(firestore, 'collection').callThrough();
    sinon.stub(bidsDb, 'addBidAttachment').rejects();
    const { result } = renderHook(() =>
      useUploadAttachment(firestore, openBid, sendNotification)
    );

    await act(async () => {
      result.current.onUploadFile(
        {
          target: {
            files: [new File(['(⌐□_□)'], 'test.png', { type: 'image/png' })]
          }
        },
        'property-1',
        'job-1',
        'bid-1'
      );
    });

    await waitFor(() => sendReport.called);

    // Error send check
    const actual = sendReport.called;
    expect(actual).toEqual(expected);

    // Send notification check
    const resultNotification = sendNotification.firstCall || { args: [] };
    const actualNotification = resultNotification.args[1]
      ? resultNotification.args[1].type
      : '';
    expect(actualNotification).toEqual(expectedNotification);
  });
});
