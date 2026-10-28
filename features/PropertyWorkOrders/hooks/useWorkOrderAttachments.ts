import { useEffect, useRef, useState } from 'react';
import yardiApi from '../../../common/services/api/yardi';
import yardiWorkOrderAttachment, {
  WORK_ORDER_ATTACHMENT_DESCRIPTION_MAX_LENGTH
} from '../../../common/models/yardi/workOrderAttachment';
import errorReports from '../../../common/services/api/errorReports';
import ErrorForbidden from '../../../common/models/errors/forbidden';
import ErrorNotFound from '../../../common/models/errors/notFound';
import ErrorBadRequest from '../../../common/models/errors/badRequest';
import ErrorBadGateway from '../../../common/models/errors/badGateway';
import ErrorProxyForbidden from '../../../common/models/errors/proxyForbidden';
import ErrorItem from '../../../common/models/errors/item';
import { toFieldName } from './useWorkOrderForm';
import {
  AttachmentUploadErrors,
  downscaleImage,
  errorMessages,
  fileExtension,
  isImageFile,
  readFileAsBase64,
  validateAttachmentUpload
} from '../utils/attachments';

const PREFIX = 'features: PropertyWorkOrders: hooks: useWorkOrderAttachments:';

type userNotifications = (message: string, options?: any) => any;

// API pointers naming the
// upload form's fields
const FILE_POINTERS = ['data', 'extension', 'attachment'];

export interface useWorkOrderAttachmentsResult {
  status: string;
  data: yardiWorkOrderAttachment[];
  error: string;
  refetch(): void;
  loadAttachment(name: string): Promise<yardiWorkOrderAttachment | null>;
  upload(
    file: File | null,
    description: string
  ): Promise<yardiWorkOrderAttachment | null>;
  isUploading: boolean;
  uploadErrors: AttachmentUploadErrors;
  generalUploadErrors: string[];
  clearUploadErrors(): void;
}

// Split the API's upload rejections into
// those for the file, the description,
// and anything else
export function toUploadErrors(errors: ErrorItem[]): {
  uploadErrors: AttachmentUploadErrors;
  generalUploadErrors: string[];
} {
  const uploadErrors: AttachmentUploadErrors = {};
  const generalUploadErrors: string[] = [];

  errors.forEach((err) => {
    const field = toFieldName(err.name);
    const message = err.detail || err.title || 'Rejected by Yardi';

    if (FILE_POINTERS.includes(field) && !uploadErrors.file) {
      uploadErrors.file = message;
    } else if (field === 'description' && !uploadErrors.description) {
      uploadErrors.description = message;
    } else {
      generalUploadErrors.push(message);
    }
  });

  return { uploadErrors, generalUploadErrors };
}

const toListError = (apiError: Error): string => {
  if (apiError instanceof ErrorForbidden) {
    return 'You do not have permission to view attachments for this property';
  }
  if (apiError instanceof ErrorProxyForbidden) {
    return 'Either the organization or this property is not properly configured for Yardi';
  }
  if (apiError instanceof ErrorNotFound) {
    return 'This work order could not be found in Yardi';
  }
  if (apiError instanceof ErrorBadGateway) {
    return 'Yardi could not provide the attachments, please try again.';
  }
  return 'Attachments could not be loaded, please try again or contact an admin.';
};

const isExpectedError = (apiError: Error): boolean =>
  apiError instanceof ErrorForbidden ||
  apiError instanceof ErrorProxyForbidden ||
  apiError instanceof ErrorNotFound ||
  apiError instanceof ErrorBadRequest ||
  apiError instanceof ErrorBadGateway;

// List a work order's attachments, fetch
// one with its file on demand, and upload
// new files, surfacing Yardi's rejections
export default function useWorkOrderAttachments(
  sendNotification: userNotifications,
  propertyId: string,
  workOrderId: string
): useWorkOrderAttachmentsResult {
  const [status, setStatus] = useState('loading');
  const [data, setData] = useState<yardiWorkOrderAttachment[]>([]);
  const [error, setError] = useState('');
  const [reloadCount, setReloadCount] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [apiUploadErrors, setApiUploadErrors] = useState<ErrorItem[]>([]);
  const [clientUploadErrors, setClientUploadErrors] =
    useState<AttachmentUploadErrors>({});

  // Files already fetched, so a
  // second view never re-downloads
  const cache = useRef<Record<string, yardiWorkOrderAttachment>>({});

  const { uploadErrors: apiFieldErrors, generalUploadErrors } =
    toUploadErrors(apiUploadErrors);
  const uploadErrors = { ...apiFieldErrors, ...clientUploadErrors };

  const clearUploadErrors = () => {
    setApiUploadErrors([]);
    setClientUploadErrors({});
  };

  const refetch = () => setReloadCount((count) => count + 1);

  useEffect(() => {
    if (!propertyId || !workOrderId) return undefined;
    let isCurrent = true;
    setStatus('loading');
    setError('');

    yardiApi
      .getWorkOrderAttachmentsRequest(propertyId, workOrderId)
      .then((result) => {
        if (!isCurrent) return;
        setData(result);
        setStatus('success');
      })
      .catch((apiError: Error) => {
        if (!isCurrent) return;
        setError(toListError(apiError));
        setStatus('error');
        if (!isExpectedError(apiError)) {
          // eslint-disable-next-line import/no-named-as-default-member
          errorReports.send(
            Error(`${PREFIX} Could not load work order attachments`)
          );
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [propertyId, workOrderId, reloadCount]);

  const loadAttachment = async (
    name: string
  ): Promise<yardiWorkOrderAttachment | null> => {
    const key = `${name}`.toLowerCase();
    if (cache.current[key]) return cache.current[key];

    try {
      const attachment = await yardiApi.getWorkOrderAttachmentRequest(
        propertyId,
        workOrderId,
        name
      );
      cache.current[key] = attachment;
      return attachment;
    } catch (apiError) {
      sendNotification(
        apiError instanceof ErrorNotFound
          ? 'This attachment could not be found in Yardi'
          : 'The attachment could not be loaded from Yardi, please try again.',
        { type: 'error' }
      );
      if (!isExpectedError(apiError)) {
        // eslint-disable-next-line import/no-named-as-default-member
        errorReports.send(
          Error(`${PREFIX} Could not load work order attachment`)
        );
      }
      return null;
    }
  };

  const upload = async (
    file: File | null,
    description: string
  ): Promise<yardiWorkOrderAttachment | null> => {
    const trimmedDescription = `${description || ''}`.trim();
    setApiUploadErrors([]);
    setClientUploadErrors({});
    setIsUploading(true);

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

    const validationErrors = validateAttachmentUpload(
      prepared,
      trimmedDescription
    );
    if (Object.keys(validationErrors).length) {
      setClientUploadErrors(validationErrors);
      setIsUploading(false);
      return null;
    }

    let data64 = '';
    try {
      data64 = await readFileAsBase64(prepared);
    } catch (readErr) {
      setClientUploadErrors({ file: errorMessages.fileUnreadable });
      setIsUploading(false);
      return null;
    }

    // Yardi names the stored file itself and
    // fills a blank description with boilerplate,
    // so the original file name is the caption
    // when the user gives none
    const caption = (trimmedDescription || file.name).slice(
      0,
      WORK_ORDER_ATTACHMENT_DESCRIPTION_MAX_LENGTH
    );
    const payload = {
      data: data64,
      extension: fileExtension(prepared.name),
      description: caption
    };

    try {
      const attachment = await yardiApi.createWorkOrderAttachmentRequest(
        propertyId,
        workOrderId,
        payload
      );
      sendNotification('Attachment uploaded to Yardi', { type: 'success' });
      refetch();
      return attachment;
    } catch (apiError) {
      if (apiError instanceof ErrorBadRequest) {
        setApiUploadErrors(apiError.errors);
        sendNotification('Yardi rejected the attachment', { type: 'error' });
      } else if (apiError instanceof ErrorForbidden) {
        sendNotification(
          'You do not have permission to add attachments for this property',
          { type: 'error' }
        );
      } else if (apiError instanceof ErrorProxyForbidden) {
        sendNotification(
          'Either the organization or this property is not properly configured for Yardi',
          { type: 'error' }
        );
      } else if (apiError instanceof ErrorNotFound) {
        sendNotification('This work order could not be found in Yardi', {
          type: 'error'
        });
      } else if (apiError instanceof ErrorBadGateway) {
        sendNotification(
          'Yardi could not process the attachment, please try again.',
          { type: 'error' }
        );
      } else {
        sendNotification(
          'The attachment upload failed for unexpected reasons, please try again or contact an admin.',
          { type: 'error' }
        );
        // eslint-disable-next-line import/no-named-as-default-member
        errorReports.send(
          Error(`${PREFIX} Could not complete work order attachment upload`)
        );
      }
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    status,
    data,
    error,
    refetch,
    loadAttachment,
    upload,
    isUploading,
    uploadErrors,
    generalUploadErrors,
    clearUploadErrors
  };
}
