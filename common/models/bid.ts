import bidAttachmentModel from './bidAttachment';

interface bid {
  id: string;
  attachments: Array<bidAttachmentModel>;
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
}

export default bid;
