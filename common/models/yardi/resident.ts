import OccupantModel from './occupant';

interface yardiResident {
  id?: string;
  email: string;
  eviction?: boolean;
  firstName?: string;
  homeNumber?: any;
  lastName?: string;
  lastNote?: any;
  lastNoteUpdatedAt?: number;
  leaseFrom?: string;
  leaseSqFt?: any;
  leaseTo?: string;
  leaseUnit?: any;
  middleName?: string;
  mobileNumber?: string;
  moveIn?: string;
  officeNumber?: string;
  paymentPlan?: boolean;
  paymentPlanDelinquent?: boolean;
  status?: string;
  totalCharges?: any;
  totalOwed?: any;
  yardiStatus?: string;
  sortLeaseUnit?: number;
  occupants?: OccupantModel[];
}

export default yardiResident;
