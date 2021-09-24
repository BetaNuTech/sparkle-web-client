import attachmentModel from './attachment';

interface job {
  id: string;
  title: string;
  need: string;
  authorizedRules?: 'default' | 'expedite';
  scopeOfWorkAttachments?: Array<attachmentModel>;
  scopeOfWork?: string;
  trelloCardURL?: string;
  property: string;
  createdAt?: number;
  updatedAt?: number;
  state?: 'open' | 'approved' | 'authorized' | 'complete';
  type: string;
  minBids?: number;
}

export default job;
