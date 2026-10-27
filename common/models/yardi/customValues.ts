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

// Values Yardi accepts for a property's
// work order pickers
interface yardiCustomValues {
  id?: string;
  priorities: string[];
  categories: yardiCustomCategory[];
  statuses: yardiCustomStatus[];
  reasons: yardiCustomReason[];
  resolutions: string[];
}

export default yardiCustomValues;
