interface yardiWorkOrder {
  id?: string;
  createdAt?: string | number;
  updatedAt: number;
  resident?: string;
  category?: string;
  description?: string;
  origin?: string;
  permissionToEnter?: boolean;
  priority?: string;
  problemNotes?: string;
  requestDate?: string;
  requestorEmail?: string;
  requestorName?: string;
  requestorPhone?: string;
  status?: string;
  technicianNotes?: string;
  tenantCaused?: boolean;
  unit?: string;
  updatedBy?: string;
}

export default yardiWorkOrder;
