import DeficientItemModel from '../../models/deficientItem';
import DeficientItemCompletedPhoto from '../../models/deficientItems/deficientItemCompletedPhoto';

export interface UserChanges {
  state?: string;
  currentDueDate?: number;
  currentReasonIncomplete?: string;
  currentDeferredDate?: number;
  currentPlanToFix?: string;
  currentCompleteNowReason?: string;
  currentResponsibilityGroup?: string;
  currentStartDate?: number;
  progressNote?: string;
  completedPhoto?: Record<string, DeficientItemCompletedPhoto>;
  isDuplicate?: boolean;
}

export default interface ComposableSettings {
  updatedItem: DeficientItemModel;
  currentItem: DeficientItemModel;
  userChanges: UserChanges;
  // eslint-disable-next-line semi
}
