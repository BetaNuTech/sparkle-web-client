import {
  yardiWorkOrderAttachmentUpload,
  WORK_ORDER_ATTACHMENT_DESCRIPTION_MAX_LENGTH
} from '../../../common/models/yardi/workOrderAttachment';
import ErrorForbidden from '../../../common/models/errors/forbidden';
import ErrorNotFound from '../../../common/models/errors/notFound';
import ErrorBadRequest from '../../../common/models/errors/badRequest';
import ErrorBadGateway from '../../../common/models/errors/badGateway';
import ErrorProxyForbidden from '../../../common/models/errors/proxyForbidden';
import {
  AttachmentUploadErrors,
  downscaleImage,
  errorMessages,
  fileExtension,
  isImageFile,
  readFileAsBase64,
  validateAttachmentUpload
} from './attachments';

export interface PreparedUpload {
  payload?: yardiWorkOrderAttachmentUpload;
  errors?: AttachmentUploadErrors;
}

// Turn a picked file into the API's upload
// body: shrink photos, check the limits,
// read it as base64 and caption it
export async function prepareAttachmentUpload(
  file: File | null,
  description = ''
): Promise<PreparedUpload> {
  const trimmedDescription = `${description || ''}`.trim();

  // Phone photos routinely exceed the
  // API's limit, so shrink them first
  let prepared = file;
  if (file && isImageFile(file)) {
    try {
      prepared = await downscaleImage(file);
    } catch (resizeErr) {
      prepared = file;
    }
  }

  const errors = validateAttachmentUpload(prepared, trimmedDescription);
  if (Object.keys(errors).length) return { errors };

  let data = '';
  try {
    data = await readFileAsBase64(prepared);
  } catch (readErr) {
    return { errors: { file: errorMessages.fileUnreadable } };
  }

  // Yardi names the stored file itself and
  // fills a blank description with boilerplate,
  // so the original file name is the caption
  // when the user gives none
  const caption = (trimmedDescription || file.name).slice(
    0,
    WORK_ORDER_ATTACHMENT_DESCRIPTION_MAX_LENGTH
  );

  return {
    payload: {
      data,
      extension: fileExtension(prepared.name),
      description: caption
    }
  };
}

// What to tell the user when an upload
// fails for a reason other than a 400
export const uploadFailureMessage = (apiError: Error): string => {
  if (apiError instanceof ErrorForbidden) {
    return 'You do not have permission to add attachments for this property';
  }
  if (apiError instanceof ErrorProxyForbidden) {
    return 'Either the organization or this property is not properly configured for Yardi';
  }
  if (apiError instanceof ErrorNotFound) {
    return 'This work order could not be found in Yardi';
  }
  if (apiError instanceof ErrorBadGateway) {
    return 'Yardi could not process the attachment, please try again.';
  }
  return 'The attachment upload failed for unexpected reasons, please try again or contact an admin.';
};

export const isExpectedUploadError = (apiError: Error): boolean =>
  apiError instanceof ErrorBadRequest ||
  apiError instanceof ErrorForbidden ||
  apiError instanceof ErrorProxyForbidden ||
  apiError instanceof ErrorNotFound ||
  apiError instanceof ErrorBadGateway;
