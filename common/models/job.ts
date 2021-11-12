import attachmentModel from './attachment';

type JobState = 'open' | 'approved' | 'authorized' | 'complete';

interface job {
  id: string;
  title: string;
  need: string;
  authorizedRules?: string;
  scopeOfWorkAttachments?: Array<attachmentModel>;
  scopeOfWork?: string;
  trelloCardURL?: string;
  expediteReason?: string;
  property: string;
  createdAt?: number;
  updatedAt?: number;
  state?: JobState;
  type: string;
  minBids?: number;
}

export type { JobState };
export default job;
