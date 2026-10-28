import { useEffect, useState } from 'react';
import yardiApi from '../../../common/services/api/yardi';
import yardiWorkOrderAttachment from '../../../common/models/yardi/workOrderAttachment';
import errorReports from '../../../common/services/api/errorReports';
import ErrorBadRequest from '../../../common/models/errors/badRequest';
import { QueuedAttachment } from '../utils/pendingAttachments';
import {
  isExpectedUploadError,
  prepareAttachmentUpload,
  uploadFailureMessage
} from '../utils/uploadAttachment';
import { toUploadErrors } from './useWorkOrderAttachments';

const PREFIX = 'features: PropertyWorkOrders: hooks: useAttachmentQueueUpload:';

export type QueueItemStatus = 'queued' | 'uploading' | 'done' | 'failed';

export interface QueueUploadItem extends QueuedAttachment {
  status: QueueItemStatus;
  error: string;
}

export interface useAttachmentQueueUploadResult {
  items: QueueUploadItem[];
  isUploading: boolean;
  retry(id: string): void;
  remove(id: string): void;
}

// Upload files queued while creating a work
// order, one at a time, keeping failures on
// screen with a retry rather than dropping them
export default function useAttachmentQueueUpload(
  propertyId: string,
  workOrderId: string,
  initialItems: QueuedAttachment[],
  onUploaded: (attachment: yardiWorkOrderAttachment, id: string) => void,
  onRemoved: (id: string) => void = () => null
): useAttachmentQueueUploadResult {
  const [items, setItems] = useState<QueueUploadItem[]>(() =>
    (initialItems || []).map((item) => ({
      ...item,
      status: 'queued',
      error: ''
    }))
  );
  const setItem = (id: string, changes: Partial<QueueUploadItem>) =>
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...changes } : item))
    );

  const uploadItem = async (item: QueueUploadItem) => {
    setItem(item.id, { status: 'uploading', error: '' });

    const prepared = await prepareAttachmentUpload(item.file, item.description);
    if (prepared.errors) {
      setItem(item.id, {
        status: 'failed',
        error: prepared.errors.file || prepared.errors.description
      });
      return;
    }

    try {
      const attachment = await yardiApi.createWorkOrderAttachmentRequest(
        propertyId,
        workOrderId,
        prepared.payload
      );
      setItems((prev) => prev.filter((queued) => queued.id !== item.id));
      onUploaded(attachment, item.id);
    } catch (apiError) {
      let message = uploadFailureMessage(apiError);
      if (apiError instanceof ErrorBadRequest) {
        const { uploadErrors, generalUploadErrors } = toUploadErrors(
          apiError.errors
        );
        message =
          uploadErrors.file ||
          uploadErrors.description ||
          generalUploadErrors[0] ||
          'Yardi rejected the attachment';
      } else if (!isExpectedUploadError(apiError)) {
        // eslint-disable-next-line import/no-named-as-default-member
        errorReports.send(
          Error(`${PREFIX} Could not upload a queued work order attachment`)
        );
      }
      setItem(item.id, { status: 'failed', error: message });
    }
  };

  // Send the next queued file whenever nothing
  // is in flight. Whether something is in flight
  // is read from the items themselves, not a ref:
  // React can flush this effect between a
  // success's state updates, before any ref reset
  useEffect(() => {
    if (items.some((item) => item.status === 'uploading')) return;
    const next = items.find((item) => item.status === 'queued');
    if (next) uploadItem(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  // Leaving the page would lose the files
  // still waiting to be sent
  useEffect(() => {
    const hasWork = items.some(
      (item) => item.status === 'queued' || item.status === 'uploading'
    );
    if (!hasWork || typeof window === 'undefined') return undefined;
    const warn = (evt: BeforeUnloadEvent) => {
      evt.preventDefault();
      // eslint-disable-next-line no-param-reassign
      evt.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [items]);

  const retry = (id: string) => setItem(id, { status: 'queued', error: '' });

  const remove = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    onRemoved(id);
  };

  return {
    items,
    isUploading: items.some((item) => item.status === 'uploading'),
    retry,
    remove
  };
}
