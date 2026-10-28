import {
  downscaleImage,
  errorMessages,
  fileExtension,
  formatFileSize,
  isImageAttachment,
  isImageFile,
  needsDownscale,
  readFileAsBase64,
  toDataUrl,
  toFileUrl,
  validateAttachmentUpload
} from './attachments';
import {
  yardiWorkOrderAttachmentImage,
  yardiWorkOrderAttachmentPdf
} from '../../../__mocks__/yardi/workOrderAttachments';

describe('Unit | Features | Property Work Orders | Utils | Attachments', () => {
  test('it lower-cases a file extension and tolerates names without one', () => {
    expect(fileExtension('Photo.JPG')).toEqual('jpg');
    expect(fileExtension('scan.final.PDF')).toEqual('pdf');
    expect(fileExtension('README')).toEqual('');
    expect(fileExtension('')).toEqual('');
  });

  test('it recognises images by content type or extension', () => {
    expect(isImageAttachment(yardiWorkOrderAttachmentImage)).toEqual(true);
    expect(isImageAttachment(yardiWorkOrderAttachmentPdf)).toEqual(false);
    expect(isImageAttachment({ contentType: '', extension: 'PNG' })).toEqual(
      true
    );
  });

  test('it formats file sizes for display', () => {
    expect(formatFileSize(512)).toEqual('512 B');
    expect(formatFileSize(204800)).toEqual('200 KB');
    expect(formatFileSize(1572864)).toEqual('1.5 MB');
    expect(formatFileSize(undefined)).toEqual('');
  });

  test('it validates an upload against the api limits', () => {
    expect(validateAttachmentUpload(null).file).toEqual(
      errorMessages.fileRequired
    );
    expect(
      validateAttachmentUpload(new File(['x'], 'noextension')).file
    ).toEqual(errorMessages.fileExtension);

    const big = new File(['x'], 'big.jpg');
    Object.defineProperty(big, 'size', { value: 6 * 1024 * 1024 + 1 });
    expect(validateAttachmentUpload(big).file).toEqual(
      errorMessages.fileTooLarge
    );

    expect(
      validateAttachmentUpload(new File(['x'], 'ok.jpg'), 'a'.repeat(101))
        .description
    ).toEqual(errorMessages.descriptionTooLong);
    expect(validateAttachmentUpload(new File(['x'], 'ok.jpg'), 'fine')).toEqual(
      {}
    );
  });

  test('it reads a file as base64 without the data url prefix', async () => {
    const actual = await readFileAsBase64(
      new File(['hello'], 'hello.txt', { type: 'text/plain' })
    );
    expect(actual).toEqual('aGVsbG8=');
  });

  test('it builds a data url from an attachment and falls back to it for file urls', () => {
    const attachment = { ...yardiWorkOrderAttachmentImage, data: 'abc=' };
    expect(toDataUrl(attachment)).toEqual('data:image/jpeg;base64,abc=');
    // jsdom has no object urls
    expect(toFileUrl(attachment)).toEqual('data:image/jpeg;base64,abc=');
  });

  test('it recognises image files by type or extension', () => {
    expect(
      isImageFile(new File([''], 'a.heic', { type: 'image/heic' }))
    ).toEqual(true);
    expect(isImageFile(new File([''], 'a.JPG'))).toEqual(true);
    expect(
      isImageFile(new File([''], 'a.pdf', { type: 'application/pdf' }))
    ).toEqual(false);
  });

  test('it only re-encodes photos that are large on an edge or heavy', () => {
    expect(needsDownscale(4032, 3024, 500000)).toEqual(true);
    expect(needsDownscale(1600, 1200, 3 * 1024 * 1024)).toEqual(true);
    expect(needsDownscale(1600, 1200, 500000)).toEqual(false);
  });

  test('it leaves files untouched where photos cannot be decoded', async () => {
    const photo = new File(['x'], 'photo.jpg', { type: 'image/jpeg' });
    const pdf = new File(['x'], 'doc.pdf', { type: 'application/pdf' });
    // jsdom has no createImageBitmap
    expect(await downscaleImage(photo)).toBe(photo);
    expect(await downscaleImage(pdf)).toBe(pdf);
  });
});
