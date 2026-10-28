import { renderHook, act } from '@testing-library/react-hooks';
import sinon from 'sinon';
import yardiApi from '../../../common/services/api/yardi';
import errorReports from '../../../common/services/api/errorReports';
import ErrorBadRequest from '../../../common/models/errors/badRequest';
import ErrorForbidden from '../../../common/models/errors/forbidden';
import attachments, {
  yardiWorkOrderAttachmentImage,
  yardiWorkOrderAttachmentData
} from '../../../__mocks__/yardi/workOrderAttachments';
import useWorkOrderAttachments, {
  toUploadErrors
} from './useWorkOrderAttachments';

const badRequest = (pointer: string, detail: string) => {
  const err = new ErrorBadRequest('fix request errors');
  err.addErrors([{ source: { pointer }, title: 'Bad Request', detail }]);
  return err;
};

describe('Unit | Features | Property Work Orders | Hooks | Use Work Order Attachments', () => {
  afterEach(() => sinon.restore());

  test('it maps api pointers onto the upload form fields', () => {
    const { uploadErrors, generalUploadErrors } = toUploadErrors([
      { name: '/data/attributes/extension', detail: 'bad extension' },
      { name: '/data/attributes/attachment', detail: 'Invalid File Extension' },
      { name: '/description', detail: 'too long' },
      { name: '/body', detail: 'something else' }
    ]);
    expect(uploadErrors).toEqual({
      file: 'bad extension',
      description: 'too long'
    });
    expect(generalUploadErrors).toEqual([
      'Invalid File Extension',
      'something else'
    ]);
  });

  test('it lists a work orders attachments', async () => {
    sinon
      .stub(yardiApi, 'getWorkOrderAttachmentsRequest')
      .resolves(attachments);
    const { result, waitForNextUpdate } = renderHook(() =>
      useWorkOrderAttachments(() => null, 'property-1', '531781')
    );
    expect(result.current.status).toEqual('loading');
    await waitForNextUpdate();
    expect(result.current.status).toEqual('success');
    expect(result.current.data).toEqual(attachments);
  });

  test('it explains a known list failure without reporting it', async () => {
    sinon
      .stub(yardiApi, 'getWorkOrderAttachmentsRequest')
      .rejects(new ErrorForbidden('no'));
    const report = sinon.stub(errorReports, 'send').resolves();
    const { result, waitForNextUpdate } = renderHook(() =>
      useWorkOrderAttachments(() => null, 'property-1', '531781')
    );
    await waitForNextUpdate();
    expect(result.current.status).toEqual('error');
    expect(result.current.error).toContain('permission');
    expect(report.called).toEqual(false);
  });

  test('it reports an unexpected list failure', async () => {
    sinon
      .stub(yardiApi, 'getWorkOrderAttachmentsRequest')
      .rejects(Error('boom'));
    const report = sinon.stub(errorReports, 'send').resolves();
    const { result, waitForNextUpdate } = renderHook(() =>
      useWorkOrderAttachments(() => null, 'property-1', '531781')
    );
    await waitForNextUpdate();
    expect(result.current.status).toEqual('error');
    expect(report.called).toEqual(true);
  });

  test('it fetches an attachment with its file once and caches it', async () => {
    sinon
      .stub(yardiApi, 'getWorkOrderAttachmentsRequest')
      .resolves(attachments);
    const full = {
      ...yardiWorkOrderAttachmentImage,
      data: yardiWorkOrderAttachmentData
    };
    const get = sinon
      .stub(yardiApi, 'getWorkOrderAttachmentRequest')
      .resolves(full);
    const { result, waitForNextUpdate } = renderHook(() =>
      useWorkOrderAttachments(() => null, 'property-1', '531781')
    );
    await waitForNextUpdate();

    let loaded = null;
    await act(async () => {
      loaded = await result.current.loadAttachment(full.name);
    });
    await act(async () => {
      await result.current.loadAttachment(full.name.toUpperCase());
    });
    expect(loaded).toEqual(full);
    expect(get.callCount).toEqual(1);
    expect(get.firstCall.args).toEqual(['property-1', '531781', full.name]);
  });

  test('it validates before uploading and posts the file as base64 with its extension', async () => {
    sinon.stub(yardiApi, 'getWorkOrderAttachmentsRequest').resolves([]);
    const create = sinon
      .stub(yardiApi, 'createWorkOrderAttachmentRequest')
      .resolves(yardiWorkOrderAttachmentImage);
    const sendNotification = sinon.spy();
    const { result, waitForNextUpdate } = renderHook(() =>
      useWorkOrderAttachments(sendNotification, 'property-1', '531781')
    );
    await waitForNextUpdate();

    await act(async () => {
      await result.current.upload(null, '');
    });
    expect(result.current.uploadErrors.file).toBeTruthy();
    expect(create.called).toEqual(false);

    await act(async () => {
      await result.current.upload(
        new File(['hello'], 'Gate.JPG', { type: 'image/jpeg' }),
        '  Pool gate  '
      );
    });
    expect(create.firstCall.args).toEqual([
      'property-1',
      '531781',
      { data: 'aGVsbG8=', extension: 'jpg', description: 'Pool gate' }
    ]);
    expect(result.current.uploadErrors).toEqual({});
    expect(sendNotification.firstCall.args[0]).toContain('uploaded');
  });

  test('it shows yardi upload rejections against the file', async () => {
    sinon.stub(yardiApi, 'getWorkOrderAttachmentsRequest').resolves([]);
    sinon
      .stub(yardiApi, 'createWorkOrderAttachmentRequest')
      .rejects(badRequest('/attachment', 'Invalid File Extension: exe'));
    const { result, waitForNextUpdate } = renderHook(() =>
      useWorkOrderAttachments(() => null, 'property-1', '531781')
    );
    await waitForNextUpdate();

    await act(async () => {
      await result.current.upload(new File(['x'], 'virus.exe'), '');
    });
    expect(result.current.uploadErrors.file).toEqual(
      'Invalid File Extension: exe'
    );
    expect(result.current.isUploading).toEqual(false);
  });

  test('it captions an upload with the original file name when no description is given', async () => {
    sinon.stub(yardiApi, 'getWorkOrderAttachmentsRequest').resolves([]);
    const create = sinon
      .stub(yardiApi, 'createWorkOrderAttachmentRequest')
      .resolves(yardiWorkOrderAttachmentImage);
    const { result, waitForNextUpdate } = renderHook(() =>
      useWorkOrderAttachments(() => null, 'property-1', '531781')
    );
    await waitForNextUpdate();

    await act(async () => {
      await result.current.upload(
        new File(['hello'], 'IMG_0042.jpg', { type: 'image/jpeg' }),
        '   '
      );
    });
    expect(create.firstCall.args[2].description).toEqual('IMG_0042.jpg');
  });
});
