import pipe from '../pipe';
import inspectionTemplateItemModel from '../../models/inspectionTemplateItem';

export interface userUpdate {
  mainInputSelection?: number;
  isItemNA?: boolean;
  textInputValue?: string;
  mainInputNotes?: string;
  inspectorNotes?: string;
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

// Manage local updates to inspection item
export default function updateTemplateItem(
  updatedItem: inspectionTemplateItemModel,
  currentItem: inspectionTemplateItemModel,
  userChanges: userUpdate,
  userChangeOptions?: updateOptions
): inspectionTemplateItemModel {
  const options = {
    ...DEFAULT_OPTIONS,
    ...(userChangeOptions || {})
  } as updateOptions;
  // so users can add item's from multi-sections
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
    setTextInputItemValue,
    setOneActionNoteItemValue,
    setItemsInspectorNote,
    setMainInputItemSelected,
    setOneActionNoteItemSelected,
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
  const isMainInputItem =
    currentItem.itemType === 'main' && Boolean(currentItem.mainInputType);

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
    isMainInputItem &&
    typeof result.mainInputSelection === 'undefined' &&
    !hasCurrentSelection
  ) {
    result.mainInputSelection = -1;
  }

  return result;
};

// Set the value of a text input item
function setTextInputItemValue(
  result: inspectionTemplateItemModel,
  settings: composableSettings
): inspectionTemplateItemModel {
  const { userChanges, currentItem, updatedItem } = settings;
  const isChanging = typeof userChanges.textInputValue === 'string';
  const isTextInputItem = Boolean(currentItem.isTextInputItem);
  const hasPreviousUpdate = typeof updatedItem.textInputValue === 'string';
  const isDifferentThanCurrent =
    userChanges.textInputValue !== currentItem.textInputValue;

  // Provide previous update
  if (!isChanging && hasPreviousUpdate) {
    result.textInputValue = updatedItem.textInputValue;
  }

  // Add user change to updates
  if (isChanging && isTextInputItem && isDifferentThanCurrent) {
    result.textInputValue = userChanges.textInputValue;
  }

  // Remove undifferentiated change from updates
  if (isChanging && isTextInputItem && !isDifferentThanCurrent) {
    delete result.textInputValue;
  }

  return result;
}

// Set the text value of a main input note item
function setOneActionNoteItemValue(
  result: inspectionTemplateItemModel,
  settings: composableSettings
): inspectionTemplateItemModel {
  const { userChanges, currentItem, updatedItem } = settings;
  const isChanging = typeof userChanges.mainInputNotes === 'string';
  const hasPreviousUpdate = typeof updatedItem.mainInputNotes === 'string';
  const value = `${userChanges.mainInputNotes || ''}`.trim();
  const isDifferentThanCurrent = value !== currentItem.mainInputNotes;

  // Provide previous update
  if (!isChanging && hasPreviousUpdate) {
    result.mainInputNotes = updatedItem.mainInputNotes;
  }

  // Add user change to updates
  if (isChanging && isDifferentThanCurrent) {
    result.mainInputNotes = value;
  }

  // Remove undifferentiated change from updates
  if (isChanging && !isDifferentThanCurrent) {
    delete result.mainInputNotes;
  }

  return result;
}

// Set item's inspector notes
function setItemsInspectorNote(
  result: inspectionTemplateItemModel,
  settings: composableSettings
): inspectionTemplateItemModel {
  const { userChanges, currentItem, updatedItem } = settings;
  const isChanging = typeof userChanges.inspectorNotes === 'string';
  const hasPreviousUpdate = typeof updatedItem.inspectorNotes === 'string';
  const value = `${userChanges.inspectorNotes || ''}`.trim();
  const isDifferentThanCurrent = value !== (currentItem.inspectorNotes || '');

  // Provide previous update
  if (!isChanging && hasPreviousUpdate) {
    result.inspectorNotes = updatedItem.inspectorNotes;
  }

  // Add user change to updates
  if (isChanging && isDifferentThanCurrent) {
    result.inspectorNotes = value;
  }

  // Remove undifferentiated change from updates
  if (isChanging && !isDifferentThanCurrent) {
    delete result.inspectorNotes;
  }

  return result;
}

// Set if a main input item has
// been selected by the user
const setMainInputItemSelected = (
  result: inspectionTemplateItemModel,
  settings: composableSettings
): inspectionTemplateItemModel => {
  const { userChanges, currentItem, updatedItem } = settings;
  const isOneActionNote = getMainItemType(currentItem) === 'oneaction_notes';
  const isNowUnselected = result.mainInputSelection === -1;
  const isNowSelected =
    typeof result.mainInputSelection === 'number'
      ? result.mainInputSelection > -1
      : false;
  const isChanging = typeof userChanges.mainInputSelection === 'number';
  const hasPreviousUpdate = typeof updatedItem.mainInputSelected === 'boolean';

  // Ignore unapplicable item updates
  if (isOneActionNote) {
    return result;
  }

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

// Update One Action Note selected attribute
const setOneActionNoteItemSelected = (
  result: inspectionTemplateItemModel,
  settings: composableSettings
): inspectionTemplateItemModel => {
  const { userChanges, currentItem, updatedItem } = settings;
  const isOneActionNote = getMainItemType(currentItem) === 'oneaction_notes';
  const isNowUnanswered = result.mainInputNotes === '';
  const isNowAnswered =
    typeof result.mainInputNotes === 'string'
      ? result.mainInputNotes.length > 0
      : false;
  const isChanging = typeof userChanges.mainInputNotes === 'string';
  const hasPreviousUpdate = typeof updatedItem.mainInputSelected === 'boolean';

  // Ignore unapplicable item updates
  if (!isOneActionNote) {
    return result;
  }

  // Provide previous update
  if (!isChanging && hasPreviousUpdate) {
    result.mainInputSelected = updatedItem.mainInputSelected;
  }

  // Add user non-answer change to updates
  if (isNowUnanswered && currentItem.mainInputSelected) {
    result.mainInputSelected = false;
  }

  // Add user answer change to updates
  if (isNowAnswered && !currentItem.mainInputSelected) {
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

// Create lowercased main input type
function getMainItemType(item: inspectionTemplateItemModel): string {
  return `${item.mainInputType || ''}`.toLowerCase();
}
