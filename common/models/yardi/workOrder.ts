interface yardiWorkOrder {
  id?: string;
  createdAt?: string | number;
  updatedAt: number;
  resident?: string;
  category?: string;
  subCategory?: string;
  description?: string;
  briefDescription?: string;
  origin?: string;
  permissionToEnter?: boolean;
  priority?: string;
  problemNotes?: string;
  accessNotes?: string;
  requestDate?: string;
  dueDate?: string;
  requestorEmail?: string;
  requestorName?: string;
  requestorPhone?: string;
  status?: string;
  reason?: string;
  resolution?: string;
  vendor?: string;
  technicianNotes?: string;
  tenantCaused?: boolean;
  unit?: string;
  updatedBy?: string;
  hasAttachments?: boolean; // Yardi's own flag; absent on older API responses
}

// Attributes a user may write when
// creating or updating a work order
export type yardiWorkOrderWritable = Omit<
  yardiWorkOrder,
  | 'id'
  | 'createdAt'
  | 'updatedAt'
  | 'updatedBy'
  | 'requestDate'
  | 'hasAttachments'
>;

// Yardi's maximum attribute lengths,
// enforced by the API with 400 responses
export const WORK_ORDER_MAX_LENGTHS: Record<string, number> = Object.freeze({
  unit: 8,
  resident: 8,
  vendor: 12,
  briefDescription: 35,
  description: 1500,
  priority: 30,
  category: 30,
  subCategory: 30,
  status: 30,
  reason: 100,
  resolution: 50,
  accessNotes: 1500,
  problemNotes: 1500,
  technicianNotes: 1500,
  requestorName: 200,
  requestorPhone: 20,
  requestorEmail: 80,
  dueDate: 19,
  origin: 10
});

// Yardi's status for a cancelled work order
export const WORK_ORDER_CANCELED_STATUS = 'Canceled';

export default yardiWorkOrder;
