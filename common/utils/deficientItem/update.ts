import moment from 'moment';
import pipe from '../pipe';
import DeficientItemModel from '../../models/deficientItem';
import ComposableSettings, { UserChanges } from './composableSettings';

const PREFIX = 'utils: deficientItem: update';

// Save a deficient item with updates
// relavant to its' target state
export default function deficientItemSave(
  updatedItem: DeficientItemModel,
  currentItem: DeficientItemModel,
  userChanges: UserChanges
): DeficientItemModel {
  const changeCount = userChanges ? Object.keys(userChanges).length : 0;

  if (changeCount < 1) {
    throw Error(`${PREFIX} requires at least one change`);
  }

  if (changeCount > 1) {
    throw Error(`${PREFIX} handles only 1 change`);
  }

  return pipe(
    setState,
    setCurrentDueDate,
    setCurrentDeferredDate,
    setCurrentPlanToFix,
    setCurrentResponsibilityGroup,
    setProgressNote,
    setCurrentReasonIncomplete,
    setCurrentCompleteNowReason
  )(
    {} as DeficientItemModel, // result
    {
      updatedItem,
      currentItem,
      userChanges
    } as ComposableSettings
  );
}

const setState = (result: DeficientItemModel, settings: ComposableSettings) => {
  const { userChanges, currentItem, updatedItem } = settings;

  const isChanging = typeof userChanges.state === 'string';
  const hasPreviousUpdate = typeof updatedItem.state === 'string';

  // Provide previous update
  if (!isChanging && hasPreviousUpdate) {
    result.state = updatedItem.state;
  }

  // Add user unselected change to updates
  if (isChanging && userChanges.state !== currentItem.state) {
    result.state = userChanges.state;
  } else if (isChanging) {
    delete result.state;
  }

  return result;
};

// Set current due date
const setCurrentDueDate = (
  result: DeficientItemModel,
  settings: ComposableSettings
) => {
  const { userChanges, currentItem, updatedItem } = settings;

  const isChanging =
    userChanges.currentDueDate &&
    moment.unix(userChanges.currentDueDate).isValid();
  const hasPreviousUpdate =
    updatedItem.currentDueDate &&
    moment.unix(updatedItem.currentDueDate).isValid();
  // Provide previous update
  if (!isChanging && hasPreviousUpdate) {
    result.currentDueDate = updatedItem.currentDueDate;
  }

  // Add user unselected change to updates
  if (isChanging && userChanges.currentDueDate !== currentItem.currentDueDate) {
    result.currentDueDate = userChanges.currentDueDate;
  } else if (isChanging) {
    delete result.currentDueDate;
  }

  return result;
};

// Set current deferred date
const setCurrentDeferredDate = (
  result: DeficientItemModel,
  settings: ComposableSettings
) => {
  const { userChanges, currentItem, updatedItem } = settings;

  const isChanging =
    userChanges.currentDeferredDate &&
    moment.unix(userChanges.currentDeferredDate).isValid();
  const hasPreviousUpdate =
    updatedItem.currentDueDate &&
    moment.unix(updatedItem.currentDueDate).isValid();

  // Provide previous update
  if (!isChanging && hasPreviousUpdate) {
    result.currentDeferredDate = updatedItem.currentDeferredDate;
  }

  // Add user unselected change to updates
  if (
    isChanging &&
    userChanges.currentDeferredDate !== currentItem.currentDeferredDate
  ) {
    result.currentDeferredDate = userChanges.currentDeferredDate;
  } else if (isChanging) {
    delete result.currentDeferredDate;
  }

  return result;
};

// Set current plan to fix value
const setCurrentPlanToFix = (
  result: DeficientItemModel,
  settings: ComposableSettings
) => {
  const { userChanges, currentItem, updatedItem } = settings;

  const isChanging = typeof userChanges.currentPlanToFix === 'string';
  const hasPreviousUpdate = typeof updatedItem.currentPlanToFix === 'string';
  const value = `${userChanges.currentPlanToFix || ''}`.trim();
  const isDifferentThanCurrent = value !== (currentItem.currentPlanToFix || '');

  // Provide previous update
  if (!isChanging && hasPreviousUpdate) {
    result.currentPlanToFix = updatedItem.currentPlanToFix;
  }

  // Add user change to updates
  if (isChanging && isDifferentThanCurrent) {
    result.currentPlanToFix = value;
  }

  // Remove undifferentiated change from updates
  if (isChanging && !isDifferentThanCurrent) {
    delete result.currentPlanToFix;
  }

  return result;
};

// Set current responsibility group value
const setCurrentResponsibilityGroup = (
  result: DeficientItemModel,
  settings: ComposableSettings
) => {
  const { userChanges, currentItem, updatedItem } = settings;

  const isChanging = typeof userChanges.currentResponsibilityGroup === 'string';
  const hasPreviousUpdate =
    typeof updatedItem.currentResponsibilityGroup === 'string';
  const value = userChanges.currentResponsibilityGroup;
  const isDifferentThanCurrent =
    value !== (currentItem.currentResponsibilityGroup || '');
  // Provide previous update

  if (!isChanging && hasPreviousUpdate) {
    result.currentResponsibilityGroup = updatedItem.currentResponsibilityGroup;
  }

  // Add user change to updates
  if (isChanging && isDifferentThanCurrent) {
    result.currentResponsibilityGroup = value;
  }

  // Remove undifferentiated change from updates
  if (isChanging && !isDifferentThanCurrent) {
    delete result.currentResponsibilityGroup;
  }

  return result;
};

// Set progress note value
const setProgressNote = (
  result: DeficientItemModel,
  settings: ComposableSettings
) => {
  const { userChanges, currentItem, updatedItem } = settings;

  const isChanging = typeof userChanges.progressNote === 'string';
  const hasPreviousUpdate = typeof updatedItem.progressNote === 'string';
  const value = `${userChanges.progressNote || ''}`.trim();
  const isDifferentThanCurrent = value !== (currentItem.progressNote || '');

  // Provide previous update
  if (!isChanging && hasPreviousUpdate) {
    result.progressNote = updatedItem.progressNote;
  }

  // Add user change to updates
  if (isChanging && isDifferentThanCurrent) {
    result.progressNote = value;
  }

  // Remove undifferentiated change from updates
  if (isChanging && !isDifferentThanCurrent) {
    delete result.progressNote;
  }

  return result;
};

// Set current reason incomplete value
const setCurrentReasonIncomplete = (
  result: DeficientItemModel,
  settings: ComposableSettings
) => {
  const { userChanges, currentItem, updatedItem } = settings;

  const isChanging = typeof userChanges.currentReasonIncomplete === 'string';
  const hasPreviousUpdate =
    typeof updatedItem.currentReasonIncomplete === 'string';
  const value = `${userChanges.currentReasonIncomplete || ''}`.trim();
  const isDifferentThanCurrent =
    value !== (currentItem.currentReasonIncomplete || '');

  // Provide previous update
  if (!isChanging && hasPreviousUpdate) {
    result.currentReasonIncomplete = updatedItem.currentReasonIncomplete;
  }

  // Add user change to updates
  if (isChanging && isDifferentThanCurrent) {
    result.currentReasonIncomplete = value;
  }

  // Remove undifferentiated change from updates
  if (isChanging && !isDifferentThanCurrent) {
    delete result.currentReasonIncomplete;
  }

  return result;
};

// Set current complete now reason value
const setCurrentCompleteNowReason = (
  result: DeficientItemModel,
  settings: ComposableSettings
) => {
  const { userChanges, currentItem, updatedItem } = settings;

  const isChanging = typeof userChanges.currentCompleteNowReason === 'string';
  const hasPreviousUpdate =
    typeof updatedItem.currentCompleteNowReason === 'string';
  const value = `${userChanges.currentCompleteNowReason || ''}`.trim();
  const isDifferentThanCurrent =
    value !== (currentItem.currentCompleteNowReason || '');

  // Provide previous update
  if (!isChanging && hasPreviousUpdate) {
    result.currentCompleteNowReason = updatedItem.currentCompleteNowReason;
  }

  // Add user change to updates
  if (isChanging && isDifferentThanCurrent) {
    result.currentCompleteNowReason = value;
  }

  // Remove undifferentiated change from updates
  if (isChanging && !isDifferentThanCurrent) {
    delete result.currentCompleteNowReason;
  }

  return result;
};
