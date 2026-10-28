import ErrorForbidden from '../../../common/models/errors/forbidden';
import ErrorBadGateway from '../../../common/models/errors/badGateway';
import { errorMessages } from './attachments';
import {
  isExpectedUploadError,
  prepareAttachmentUpload,
  uploadFailureMessage
} from './uploadAttachment';

describe('Unit | Features | Property Work Orders | Utils | Upload Attachment', () => {
  test('it prepares a base64 payload captioned with the description or file name', async () => {
    const file = new File(['hello'], 'Gate.JPG', { type: 'image/jpeg' });
    const captioned = await prepareAttachmentUpload(file, '  Pool gate ');
    expect(captioned.payload).toEqual({
      data: 'aGVsbG8=',
      extension: 'jpg',
      description: 'Pool gate'
    });

    const named = await prepareAttachmentUpload(file, '');
    expect(named.payload.description).toEqual('Gate.JPG');
    expect(named.errors).toBeUndefined();
  });

  test('it reports validation problems instead of a payload', async () => {
    expect((await prepareAttachmentUpload(null)).errors.file).toEqual(
      errorMessages.fileRequired
    );
    expect(
      (await prepareAttachmentUpload(new File(['x'], 'noext'))).errors.file
    ).toEqual(errorMessages.fileExtension);
  });

  test('it describes upload failures and knows which are expected', () => {
    expect(uploadFailureMessage(new ErrorForbidden('no'))).toContain(
      'permission'
    );
    expect(uploadFailureMessage(new ErrorBadGateway('no'))).toContain('Yardi');
    expect(uploadFailureMessage(Error('boom'))).toContain('unexpected');
    expect(isExpectedUploadError(new ErrorForbidden('no'))).toEqual(true);
    expect(isExpectedUploadError(Error('boom'))).toEqual(false);
  });
});
