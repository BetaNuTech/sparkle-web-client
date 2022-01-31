import DeficientItemModel from '../../models/deficientItem';

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
}

export default interface ComposableSettings {
  updatedItem: DeficientItemModel;
  currentItem: DeficientItemModel;
  userChanges: DeficientItemModel;
  // eslint-disable-next-line semi
}
