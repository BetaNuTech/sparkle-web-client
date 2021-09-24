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
  type:
    | 'asset management project'
    | 'property management project'
    | 'hybrid capital project';
}

export default job;
