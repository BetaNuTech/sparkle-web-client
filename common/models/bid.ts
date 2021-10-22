import attachmentModel from './attachment';

interface bid {
  id: string;
  attachments: Array<attachmentModel>;
  completeAt?: number; // Unix timestamp
  costMax: number;
  costMin: number;
  createdAt: number; // Unix timestamp
  job: string;
  startAt?: number; // Unix timestamp
  state: 'open' | 'approved' | 'rejected' | 'incomplete' | 'complete';
  scope: 'local' | 'national';
  updatedAt: number; // Unix timestamp
  vendor: string;
  vendorDetails?: string;
  vendorW9?: boolean;
  vendorInsurance?: boolean;
  vendorLicense?: boolean;
}

export default bid;
