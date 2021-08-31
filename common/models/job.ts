interface job {
  id: string;
  title: string;
  need: string;
  authorizedRules?: 'default' | 'expedite';
  scopeOfWorkAttachment?: any; // Reference of attachment id
  scopeOfWork?: string;
  trelloCardURL?: string;
  property: string;
  createdAt?: number;
  updatedAt?: number;
  state?: 'open' | 'approved' | 'authorized' | 'complete';
  type: 'improvement' | 'maintenance';
}

export default job;
