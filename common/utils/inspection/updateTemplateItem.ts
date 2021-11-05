import pipe from '../pipe';
import inspectionTemplateItemModel from '../../models/inspectionTemplateItem';

export interface userUpdate {
  mainInputSelection?: number;
  isItemNA?: boolean;
}

interface updateOptions {
  adminEdit?: boolean;
}

interface composableSettings {
  updatedItem: inspectionTemplateItemModel;
  currentItem: inspectionTemplateItemModel;
  userChanges: userUpdate;
  options: updateOptions;
}

const PREFIX = 'utils: inspection: updateTemplateItem:';
const DEFAULT_OPTIONS = Object.freeze({
  adminEdit: false
} as updateOptions);

// Manage local updates to inspection
export default function inspectionUpdateTemplateUpdate(
  updatedItem: inspectionTemplateItemModel,
  currentItem: inspectionTemplateItemModel,
  userChanges: userUpdate,
  userChangeOptions?: updateOptions
): inspectionTemplateItemModel {
  const options = {
    ...DEFAULT_OPTIONS,
    ...(userChangeOptions || {})
  } as updateOptions;
  const isPopulatedCurrentItem = Object.keys(currentItem).length > 0;
  const changeCount = Object.keys(userChanges).length;

  if (!isPopulatedCurrentItem) {
    throw Error(`${PREFIX} current item must be a valid inspection item`);
  }

  if (changeCount < 1) {
    throw Error(`${PREFIX} requires at least one change`);
  }

  // Apply user changes
  return pipe(
    setMainInputSelection,
    setMainInputSelected,
    setUnupdatedItem
  )(
    {} as inspectionTemplateItemModel, // result
    {
      updatedItem,
      currentItem,
      userChanges,
      options
    } as composableSettings
  );
}

// Set main input selection index
const setMainInputSelection = (
  result: inspectionTemplateItemModel,
  settings: composableSettings
): inspectionTemplateItemModel => {
  const { userChanges, currentItem, updatedItem } = settings;
  const isChanging = typeof userChanges.mainInputSelection === 'number';
  const hasPreviousUpdate = typeof updatedItem.mainInputSelection === 'number';
  const hasCurrentSelection =
    typeof currentItem.mainInputSelection === 'number';
  const currentSelection = hasCurrentSelection
    ? currentItem.mainInputSelection
    : -1;
  const activeSelection = hasPreviousUpdate
    ? updatedItem.mainInputSelection
    : currentSelection;
  const isDifferentThanActive =
    userChanges.mainInputSelection !== activeSelection;
  const isDifferentThanCurrent =
    userChanges.mainInputSelection !== currentItem.mainInputSelection;
  const isCurrentlyUnselected = currentItem.mainInputSelection === -1;

  // Provide previous update
  if (!isChanging && hasPreviousUpdate) {
    result.mainInputSelection = updatedItem.mainInputSelection;
  }

  // Add user change to updates
  if (isChanging && isDifferentThanActive && isDifferentThanCurrent) {
    result.mainInputSelection = userChanges.mainInputSelection;
  }

  // Toggle off any selection
  if (isChanging && !isDifferentThanActive && !isCurrentlyUnselected) {
    result.mainInputSelection = -1;
  }

  // Fallback to set undefined selection
  if (
    typeof result.mainInputSelection === 'undefined' &&
    !hasCurrentSelection
  ) {
    result.mainInputSelection = -1;
  }

  return result;
};

// Set if a main input item has
// been selected by the user
const setMainInputSelected = (
  result: inspectionTemplateItemModel,
  settings: composableSettings
): inspectionTemplateItemModel => {
  const { userChanges, currentItem, updatedItem } = settings;
  const isNowUnselected = result.mainInputSelection === -1;
  const isNowSelected =
    typeof result.mainInputSelection === 'number'
      ? result.mainInputSelection > -1
      : false;
  const isChanging = typeof userChanges.mainInputSelection === 'number';
  const hasPreviousUpdate = typeof updatedItem.mainInputSelected === 'boolean';

  // Provide previous update
  if (!isChanging && hasPreviousUpdate) {
    result.mainInputSelected = updatedItem.mainInputSelected;
  }

  // Add user unselected change to updates
  if (isNowUnselected && currentItem.mainInputSelected) {
    result.mainInputSelected = false;
  }

  // Add user selected change to updates
  if (isNowSelected && !currentItem.mainInputSelected) {
    result.mainInputSelected = true;
  }

  return result;
};

// Return falsey result when user changes
// would result in returning to pristine state
const setUnupdatedItem = (
  result: inspectionTemplateItemModel
): inspectionTemplateItemModel => {
  const hasNoUpdates = Object.keys(result).length === 0;

  if (hasNoUpdates) {
    return null;
  }

  return result;
};
