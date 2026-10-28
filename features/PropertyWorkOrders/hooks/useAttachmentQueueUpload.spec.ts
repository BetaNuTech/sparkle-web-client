import { renderHook, act } from '@testing-library/react-hooks';
import sinon from 'sinon';
import yardiApi from '../../../common/services/api/yardi';
import errorReports from '../../../common/services/api/errorReports';
import ErrorBadRequest from '../../../common/models/errors/badRequest';
import { yardiWorkOrderAttachmentImage } from '../../../__mocks__/yardi/workOrderAttachments';
import { createQueuedAttachment } from '../utils/pendingAttachments';
import useAttachmentQueueUpload from './useAttachmentQueueUpload';

const queued = (name: string, description = '') => ({
  ...createQueuedAttachment(new File(['x'], name, { type: 'image/jpeg' })),
  description
});

describe('Unit | Features | Property Work Orders | Hooks | Use Attachment Queue Upload', () => {
  afterEach(() => sinon.restore());

  test('it uploads queued files one after another and drops each on success', async () => {
    const create = sinon
      .stub(yardiApi, 'createWorkOrderAttachmentRequest')
      .resolves(yardiWorkOrderAttachmentImage);
    const onUploaded = sinon.spy();
    const { result, waitFor } = renderHook(() =>
      useAttachmentQueueUpload(
        'property-1',
        '531790',
        [queued('a.jpg', 'First'), queued('b.jpg')],
        onUploaded
      )
    );

    await waitFor(() => expect(result.current.items).toHaveLength(0));
    expect(create.callCount).toEqual(2);
    expect(create.firstCall.args[2].description).toEqual('First');
    expect(create.secondCall.args[2].description).toEqual('b.jpg');
    expect(create.firstCall.args.slice(0, 2)).toEqual(['property-1', '531790']);
    expect(onUploaded.callCount).toEqual(2);
  });

  test('it keeps a failed file on screen with the reason and retries on request', async () => {
    const err = new ErrorBadRequest('fix request errors');
    err.addErrors([
      {
        source: { pointer: '/attachment' },
        title: 'Bad',
        detail: 'Yardi said no'
      }
    ]);
    const create = sinon.stub(yardiApi, 'createWorkOrderAttachmentRequest');
    create.onFirstCall().rejects(err);
    create.onSecondCall().resolves(yardiWorkOrderAttachmentImage);
    const { result, waitFor } = renderHook(() =>
      useAttachmentQueueUpload(
        'property-1',
        '531790',
        [queued('a.jpg')],
        () => null
      )
    );

    await waitFor(() =>
      expect(result.current.items[0].status).toEqual('failed')
    );
    expect(result.current.items[0].error).toEqual('Yardi said no');

    act(() => result.current.retry(result.current.items[0].id));
    await waitFor(() => expect(result.current.items).toHaveLength(0));
    expect(create.callCount).toEqual(2);
  });

  test('it reports an unexpected failure and lets the file be removed', async () => {
    sinon
      .stub(yardiApi, 'createWorkOrderAttachmentRequest')
      .rejects(Error('boom'));
    const report = sinon.stub(errorReports, 'send').resolves();
    const { result, waitFor } = renderHook(() =>
      useAttachmentQueueUpload(
        'property-1',
        '531790',
        [queued('a.jpg')],
        () => null
      )
    );

    await waitFor(() =>
      expect(result.current.items[0].status).toEqual('failed')
    );
    expect(report.called).toEqual(true);
    act(() => result.current.remove(result.current.items[0].id));
    expect(result.current.items).toHaveLength(0);
  });
});
