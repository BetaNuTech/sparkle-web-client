// A file stored on a Yardi work order
interface yardiWorkOrderAttachment {
  id: string; // stored file name
  name: string;
  extension: string;
  contentType: string;
  attachmentType?: string;
  description?: string;
  createdAt?: string; // Yardi timestamp
  size?: number; // decoded bytes
  data?: string; // base64 content, single fetch only
}

// Payload accepted when uploading a file
export interface yardiWorkOrderAttachmentUpload {
  data: string; // base64 content
  extension: string;
  description?: string;
}

// Limits the API enforces
export const WORK_ORDER_ATTACHMENT_MAX_BYTES = 6 * 1024 * 1024;
export const WORK_ORDER_ATTACHMENT_DESCRIPTION_MAX_LENGTH = 100;

export default yardiWorkOrderAttachment;
