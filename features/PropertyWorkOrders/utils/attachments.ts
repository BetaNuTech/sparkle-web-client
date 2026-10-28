import yardiWorkOrderAttachment, {
  WORK_ORDER_ATTACHMENT_MAX_BYTES,
  WORK_ORDER_ATTACHMENT_DESCRIPTION_MAX_LENGTH
} from '../../../common/models/yardi/workOrderAttachment';

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'];

// Photos are re-encoded before upload when
// they are larger than this on either edge
// or heavier than this many bytes
export const IMAGE_MAX_EDGE = 2048;
export const IMAGE_MAX_BYTES_UNTOUCHED = 1.5 * 1024 * 1024;
export const IMAGE_JPEG_QUALITY = 0.82;

export const errorMessages = {
  fileRequired: 'Choose a file to upload',
  fileExtension: 'The file name needs an extension, such as .jpg or .pdf',
  fileTooLarge: 'The file must be 6 MB or smaller',
  fileUnreadable: 'The file could not be read, please try another',
  descriptionTooLong: `Must be ${WORK_ORDER_ATTACHMENT_DESCRIPTION_MAX_LENGTH} characters or fewer`
};

export interface AttachmentUploadErrors {
  file?: string;
  description?: string;
}

type AttachmentLike = Pick<
  yardiWorkOrderAttachment,
  'contentType' | 'extension'
>;

// Lower-cased extension of a file
// name, or blank when it has none
export const fileExtension = (fileName = ''): string => {
  const match = /\.([^./\\]+)$/.exec(`${fileName}`.trim());
  return match ? match[1].toLowerCase() : '';
};

export const isImageAttachment = (attachment: AttachmentLike): boolean =>
  `${attachment.contentType || ''}`.toLowerCase().startsWith('image/') ||
  IMAGE_EXTENSIONS.includes(`${attachment.extension || ''}`.toLowerCase());

export const isImageFile = (file: File): boolean =>
  `${file.type || ''}`.toLowerCase().startsWith('image/') ||
  IMAGE_EXTENSIONS.includes(fileExtension(file.name));

// Whether a photo is worth re-encoding:
// phone cameras produce files far over the
// API's 6 MB limit at sizes a work order
// never needs
export const needsDownscale = (
  width: number,
  height: number,
  bytes: number,
  maxEdge = IMAGE_MAX_EDGE,
  maxBytes = IMAGE_MAX_BYTES_UNTOUCHED
): boolean => width > maxEdge || height > maxEdge || bytes > maxBytes;

// Decode a photo, honouring its EXIF
// orientation where the browser allows
const decodeImage = async (file: Blob): Promise<ImageBitmap> => {
  try {
    // Newer than the bundled DOM types
    const options = { imageOrientation: 'from-image' } as unknown;
    return await createImageBitmap(file, options as ImageBitmapOptions);
  } catch (err) {
    // Older browsers reject the option
    return createImageBitmap(file);
  }
};

const canvasToBlob = (
  canvas: HTMLCanvasElement,
  type: string,
  quality: number
): Promise<Blob | null> =>
  new Promise((resolve) => canvas.toBlob(resolve, type, quality));

// Shrink a photo to fit the upload limit,
// re-encoding it as JPEG; anything that is
// not a large image, or cannot be decoded
// here, is returned untouched
export const downscaleImage = async (
  file: File,
  maxEdge = IMAGE_MAX_EDGE,
  quality = IMAGE_JPEG_QUALITY
): Promise<File> => {
  const canDecode =
    typeof createImageBitmap === 'function' && typeof document !== 'undefined';
  if (!file || !isImageFile(file) || !canDecode) return file;

  let bitmap: ImageBitmap = null;
  try {
    bitmap = await decodeImage(file);
  } catch (err) {
    return file;
  }

  const { width, height } = bitmap;
  if (!width || !height || !needsDownscale(width, height, file.size, maxEdge)) {
    bitmap.close();
    return file;
  }

  const scale = Math.min(1, maxEdge / Math.max(width, height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  const context = canvas.getContext('2d');
  if (!context || typeof canvas.toBlob !== 'function') {
    bitmap.close();
    return file;
  }

  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const blob = await canvasToBlob(canvas, 'image/jpeg', quality);
  if (!blob || blob.size >= file.size) return file;

  const baseName = file.name.replace(/\.[^.]+$/, '') || 'photo';
  return new File([blob], `${baseName}.jpg`, {
    type: 'image/jpeg',
    lastModified: file.lastModified
  });
};

export const formatFileSize = (bytes?: number): string => {
  if (typeof bytes !== 'number' || Number.isNaN(bytes) || bytes < 0) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// Yardi's timestamps are ISO-like; show
// them in the user's locale when parseable
export const formatAttachmentDate = (createdAt = ''): string => {
  if (!createdAt) return '';
  const date = new Date(createdAt);
  return Number.isNaN(date.getTime()) ? createdAt : date.toLocaleDateString();
};

// Check an upload before reading the
// file, mirroring the API's limits
export const validateAttachmentUpload = (
  file: File | null,
  description = ''
): AttachmentUploadErrors => {
  const errors: AttachmentUploadErrors = {};

  if (!file) {
    errors.file = errorMessages.fileRequired;
  } else if (!fileExtension(file.name)) {
    errors.file = errorMessages.fileExtension;
  } else if (file.size > WORK_ORDER_ATTACHMENT_MAX_BYTES) {
    errors.file = errorMessages.fileTooLarge;
  }

  if (description.length > WORK_ORDER_ATTACHMENT_DESCRIPTION_MAX_LENGTH) {
    errors.description = errorMessages.descriptionTooLong;
  }

  return errors;
};

// Read a file's content as base64
// without the data URL prefix
export const readFileAsBase64 = (file: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () =>
      reject(reader.error || Error('the file could not be read'));
    reader.onload = () => {
      const result = `${reader.result || ''}`;
      resolve(result.includes(',') ? result.split(',')[1] : result);
    };
    reader.readAsDataURL(file);
  });

export const toDataUrl = (attachment: yardiWorkOrderAttachment): string =>
  `data:${attachment.contentType || 'application/octet-stream'};base64,${
    attachment.data || ''
  }`;

// A URL the browser can show or download:
// an object URL where available (keeps
// large files out of the DOM), else a data URL
export const toFileUrl = (attachment: yardiWorkOrderAttachment): string => {
  const canUseObjectUrl =
    typeof URL !== 'undefined' &&
    typeof URL.createObjectURL === 'function' &&
    typeof atob === 'function';

  if (canUseObjectUrl) {
    try {
      const binary = atob(attachment.data || '');
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i += 1) {
        bytes[i] = binary.charCodeAt(i);
      }
      const url = URL.createObjectURL(
        new Blob([bytes], {
          type: attachment.contentType || 'application/octet-stream'
        })
      );
      // Test environments stub this out
      if (url) return url;
    } catch (err) {
      // fall through to a data URL
    }
  }

  return toDataUrl(attachment);
};

export const revokeFileUrl = (url: string): void => {
  if (
    url &&
    url.startsWith('blob:') &&
    typeof URL !== 'undefined' &&
    typeof URL.revokeObjectURL === 'function'
  ) {
    URL.revokeObjectURL(url);
  }
};
