import yardiWorkOrderAttachment, {
  WORK_ORDER_ATTACHMENT_MAX_BYTES,
  WORK_ORDER_ATTACHMENT_DESCRIPTION_MAX_LENGTH
} from '../../../common/models/yardi/workOrderAttachment';

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'];

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
