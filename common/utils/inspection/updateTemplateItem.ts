import pipe from '../pipe';
import inspectionTemplateItemModel from '../../models/inspectionTemplateItem';
import inspectionTemplateItemPhotoDataModel from '../../models/inspectionTemplateItemPhotoData';

export interface userUpdate {
  mainInputSelection?: number;
  isItemNA?: boolean;
  textInputValue?: string;
  mainInputNotes?: string;
  inspectorNotes?: string;
  photosData?: Record<string, inspectionTemplateItemPhotoDataModel>;
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
  const isPopulatedCurrentItem =
    currentItem && Object.keys(currentItem).length > 0;
  const changeCount = userChanges ? Object.keys(userChanges).length : 0;
  const photosChangeCount = userChanges
    ? Object.keys(userChanges.photosData || {}).length
    : 0;

  if (!isPopulatedCurrentItem) {
    throw Error(`${PREFIX} current item must be a valid inspection item`);
  }

  if (changeCount < 1) {
    throw Error(`${PREFIX} requires at least one change`);
  }

  if (photosChangeCount > 1) {
    throw Error(`${PREFIX} max one photo data change at a time`);
  }

  // Apply user changes
  return pipe(
    setMainInputSelection,
    setTextInputItemValue,
    setOneActionNoteItemValue,
    setItemsInspectorNote,
    setMainInputItemSelected,
    setOneActionNoteItemSelected,
    setIsItemNA,
    mergeExistingPhotoData,
    addPhotoData,
    removePhotoData,
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

// Toggle an item as not/applicable
const setIsItemNA = (
  result: inspectionTemplateItemModel,
  settings: composableSettings
): inspectionTemplateItemModel => {
  const { userChanges, currentItem, updatedItem } = settings;
  const isChanging = typeof userChanges.isItemNA === 'boolean';
  const hasPreviousUpdate = typeof updatedItem.isItemNA === 'boolean';

  // Provide previous update
  if (!isChanging && hasPreviousUpdate) {
    result.isItemNA = updatedItem.isItemNA;
  }

  // Add user unselected change to updates
  if (isChanging && userChanges.isItemNA !== currentItem.isItemNA) {
    result.isItemNA = userChanges.isItemNA;
  } else if (isChanging) {
    delete result.isItemNA;
  }

  return result;
};

// Add any previous photo data updates
const mergeExistingPhotoData = (
  result: inspectionTemplateItemModel,
  settings: composableSettings
): inspectionTemplateItemModel => {
  const { updatedItem } = settings;
  const hasPreviousUpdate = typeof updatedItem.photosData !== 'undefined';

  if (hasPreviousUpdate) {
    result.photosData = JSON.parse(JSON.stringify(updatedItem.photosData));
    Object.keys(result.photosData).forEach((id) => {
      result.photosData[id] = result.photosData[
        id
      ] as inspectionTemplateItemPhotoDataModel;
    });
  }

  return result;
};

// Add photo data to an item
const addPhotoData = (
  result: inspectionTemplateItemModel,
  settings: composableSettings
): inspectionTemplateItemModel => {
  const { userChanges, currentItem, updatedItem } = settings;
  const hasPhotoDataUpdates = typeof userChanges.photosData !== 'undefined';
  const photoDataUpdate = hasPhotoDataUpdates
    ? (Object.entries(userChanges.photosData)[0] || [])[1]
    : undefined;
  const isAddingPhoto = Boolean(photoDataUpdate);

  if (!isAddingPhoto) {
    return result;
  }

  // Create new/unique timestamp photo data ID
  let unixTimeId = Math.round(Date.now() / 1000);
  const existingPhotoIds = [
    ...Object.keys(updatedItem.photosData || {}),
    ...Object.keys(currentItem.photosData || {})
  ].map((id) => parseInt(id, 10));

  while (existingPhotoIds.includes(unixTimeId)) {
    unixTimeId += 1;
  }

  // Append update
  result.photosData = result.photosData || {};
  result.photosData[unixTimeId] = {
    ...photoDataUpdate
  } as inspectionTemplateItemPhotoDataModel;

  return result;
};

// Remove an added photo data item
const removePhotoData = (
  result: inspectionTemplateItemModel,
  settings: composableSettings
): inspectionTemplateItemModel => {
  const { userChanges, currentItem, updatedItem } = settings;
  const hasPhotoDataUpdates = typeof userChanges.photosData !== 'undefined';
  const [photoId, photoUpdate] = hasPhotoDataUpdates
    ? Object.entries(userChanges.photosData)[0] || []
    : [];
  const isRemovingPhoto = Boolean(photoId && photoUpdate === null);

  if (!isRemovingPhoto) {
    return result;
  }

  const isCurrentlyAdded = Boolean((currentItem.photosData || {})[photoId]);
  const isLocallyAdded = Boolean((updatedItem.photosData || {})[photoId]);

  if (isCurrentlyAdded) {
    // Set publishable removal of previously published item
    result.photosData = result.photosData || {};
    result.photosData[photoId] = null;
  } else if (isLocallyAdded) {
    delete result.photosData[photoId]; // remove publishable data
  }

  // Cleanup unnecessary photos data hash
  if (Object.keys(result.photosData || {}).length === 0) {
    delete result.photosData;
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
