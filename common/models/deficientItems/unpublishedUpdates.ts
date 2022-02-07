/* eslint-disable camelcase */
interface DeficientItemLocalUpdates {
  id: string;
  createdAt: number;
  property: string;
  inspection: string;
  deficiency: string;
  state: string;
  currentDueDate: number;
  currentReasonIncomplete: string;
  currentDeferredDate: number;
  currentPlanToFix: string;
  currentCompleteNowReason: string;
  currentResponsibilityGroup: string;
  currentStartDate: number;
}

export default DeficientItemLocalUpdates;
