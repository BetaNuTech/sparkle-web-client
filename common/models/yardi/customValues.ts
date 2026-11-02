export interface yardiCustomCategory {
  name: string;
  subCategories: string[];
}

export interface yardiCustomStatus {
  name: string;
  type: 'standard' | 'custom';
}

export interface yardiCustomReason {
  status: string;
  reason: string;
  required: boolean;
}

// An employee Yardi lets work orders
// of the property be assigned to
export interface yardiEmployee {
  code: string;
  name: string;
  email?: string;
  phone?: string;
}

// Values Yardi accepts for a property's
// work order pickers
interface yardiCustomValues {
  id?: string;
  priorities: string[];
  categories: yardiCustomCategory[];
  statuses: yardiCustomStatus[];
  reasons: yardiCustomReason[];
  resolutions: string[];
  employees?: yardiEmployee[]; // absent on older API responses
}

export default yardiCustomValues;
