import yardiWorkOrderAttachment from '../../common/models/yardi/workOrderAttachment';

export const yardiWorkOrderAttachmentImage: yardiWorkOrderAttachment = {
  id: 'Attachment_531781_1.jpg',
  name: 'Attachment_531781_1.jpg',
  extension: 'jpg',
  contentType: 'image/jpeg',
  attachmentType: 'Work Order',
  description: 'Pool gate latch',
  createdAt: '2026-10-28T15:52:27',
  size: 204800
};

export const yardiWorkOrderAttachmentPdf: yardiWorkOrderAttachment = {
  id: 'Attachment_531781_2.pdf',
  name: 'Attachment_531781_2.pdf',
  extension: 'pdf',
  contentType: 'application/pdf',
  attachmentType: 'Work Order',
  description: '',
  createdAt: '2026-10-28T16:10:02',
  size: 1048576
};

// A 1x1 transparent PNG
export const yardiWorkOrderAttachmentData =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

export default [yardiWorkOrderAttachmentImage, yardiWorkOrderAttachmentPdf];
