import { useState } from 'react';
import DeficientItemModel from '../../../common/models/deficientItem';
import deficientItemUtils from '../../../common/utils/deficientItem';

interface useUpdateItemResult {
  updates: DeficientItemModel;
  hasUpdates: boolean;
  updateState(state: string): DeficientItemModel;
  updateCurrentDueDate(currentDueDate: number): DeficientItemModel;
  updateCurrentDeferredDate(currentDeferredDate: number): DeficientItemModel;
  updateCurrentPlanToFix(currentPlanToFix: string): DeficientItemModel;
  updateCurrentResponsibilityGroup(
    currentResponsibilityGroup: string
  ): DeficientItemModel;
  updateProgressNote(progressNote: string): DeficientItemModel;
  updateCurrentReasonIncomplete(
    currentReasonIncomplete: string
  ): DeficientItemModel;
  updateCurrentCompleteNowReason(
    currentCompleteNowReason: string
  ): DeficientItemModel;
}

export default function useUpdateItem(
  previousUpdates: DeficientItemModel,
  currentItem: DeficientItemModel
): useUpdateItemResult {
  const [hasUpdates, setHasUpdates] = useState(
    isDeficientItemUpdated(previousUpdates || {})
  );

  const [updates, setUpdates] = useState(
    previousUpdates ? clone(previousUpdates || {}) : {}
  );

  //
  // Update Management
  //

  // Set latest deficient item updates in memory
  const applyLatestUpdates = (latestUpdates: DeficientItemModel) => {
    // Updated item has publishable state
    setHasUpdates(isDeficientItemUpdated(latestUpdates));

    // In memory save
    setUpdates({ ...latestUpdates });

    return latestUpdates;
  };

  const updateState = (state: string): DeficientItemModel =>
    applyLatestUpdates(
      deficientItemUtils.update(updates, currentItem, { state })
    );

  const updateCurrentDueDate = (currentDueDate: number): DeficientItemModel =>
    applyLatestUpdates(
      deficientItemUtils.update(updates, currentItem, { currentDueDate })
    );

  const updateCurrentDeferredDate = (
    currentDeferredDate: number
  ): DeficientItemModel =>
    applyLatestUpdates(
      deficientItemUtils.update(updates, currentItem, { currentDeferredDate })
    );

  const updateCurrentPlanToFix = (
    currentPlanToFix: string
  ): DeficientItemModel =>
    applyLatestUpdates(
      deficientItemUtils.update(updates, currentItem, { currentPlanToFix })
    );

  const updateCurrentResponsibilityGroup = (
    currentResponsibilityGroup: string
  ): DeficientItemModel =>
    applyLatestUpdates(
      deficientItemUtils.update(updates, currentItem, {
        currentResponsibilityGroup
      })
    );

  const updateProgressNote = (progressNote: string): DeficientItemModel =>
    applyLatestUpdates(
      deficientItemUtils.update(updates, currentItem, { progressNote })
    );

  const updateCurrentReasonIncomplete = (
    currentReasonIncomplete: string
  ): DeficientItemModel =>
    applyLatestUpdates(
      deficientItemUtils.update(updates, currentItem, {
        currentReasonIncomplete
      })
    );

  const updateCurrentCompleteNowReason = (
    currentCompleteNowReason: string
  ): DeficientItemModel =>
    applyLatestUpdates(
      deficientItemUtils.update(updates, currentItem, {
        currentCompleteNowReason
      })
    );

  return {
    updates,
    hasUpdates,
    updateState,
    updateCurrentDueDate,
    updateCurrentDeferredDate,
    updateCurrentPlanToFix,
    updateCurrentResponsibilityGroup,
    updateProgressNote,
    updateCurrentReasonIncomplete,
    updateCurrentCompleteNowReason
  };
}

// Check if updates contain any
// relevant user update data
function isDeficientItemUpdated(updates?: any) {
  if (!updates) return false;

  return Object.keys(updates || {}).length > 0;
}
// Deep clone an object
function clone(obj: any): any {
  return JSON.parse(JSON.stringify(obj));
}
