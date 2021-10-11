import sinon from 'sinon';
import { renderHook } from '@testing-library/react-hooks';
import { act, waitFor } from '@testing-library/react';
import { photoAttachment } from '../../../__mocks__/attachments';
import errorReports from '../../../common/services/api/errorReports';
import jobDb from '../../../common/services/firestore/jobs';
import storageApi from '../../../common/services/storage';
import useAttachmentDelete from './useAttachmentDelete';
import stubFirestore from '../../../__tests__/helpers/stubFirestore';

describe('Unit | Features | Job Edit | Hooks | Use Attachment Delete', () => {
  afterEach(() => sinon.restore());

  test('should show send notification, send error to backend on delete storage fails', async () => {
    const expected = true;
    const expectedNotification = 'error';
    const sendNotification = sinon.spy();
    const firestore = stubFirestore(); // eslint-disable-line

    sinon.stub(storageApi, 'deleteFile').throws(Error('fail'));
    const sendReport = sinon.stub(errorReports, 'send').resolves(true);

    const { result } = renderHook(() =>
      useAttachmentDelete(firestore, 'job-1', sendNotification)
    );

    await act(async () => {
      await result.current.onDeleteAttachment(photoAttachment);
      result.current.onConfirmAttachmentDelete();
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

  test('should show send notification, send error to backend on job field remove firestore fails', async () => {
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
    sinon.stub(jobDb, 'removeSOWAttachment').rejects();
    const { result } = renderHook(() =>
      useAttachmentDelete(firestore, 'job-1', sendNotification)
    );

    await act(async () => {
      await result.current.onDeleteAttachment(photoAttachment);
      result.current.onConfirmAttachmentDelete();
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
