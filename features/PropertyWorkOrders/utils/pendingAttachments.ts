// Files picked while creating a work order.
// Yardi cannot take files in the create call,
// so they wait here until the new work order
// has an id and its page uploads them.

export interface QueuedAttachment {
  id: string; // client-side key
  file: File;
  description: string;
}

let nextId = 0;

export const createQueuedAttachment = (file: File): QueuedAttachment => {
  nextId += 1;
  return { id: `queued-${Date.now()}-${nextId}`, file, description: '' };
};

// In-memory only: File objects cannot be
// serialised, and a full reload drops them
const pending = new Map<string, QueuedAttachment[]>();

export const stashPendingAttachments = (
  workOrderId: string,
  items: QueuedAttachment[]
): void => {
  if (items.length) pending.set(`${workOrderId}`, items);
};

// Hand the queue over once; a second
// call for the same id gets nothing
export const takePendingAttachments = (
  workOrderId: string
): QueuedAttachment[] => {
  const key = `${workOrderId}`;
  const items = pending.get(key) || [];
  pending.delete(key);
  return items;
};
