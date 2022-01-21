import pipe from '../../pipe';
import inspectionTemplateItemModel from '../../../models/inspectionTemplateItem';
import inspectionTemplateItemPhotoDataModel from '../../../models/inspectionTemplateItemPhotoData';
import userUpdate from './userUpdate';
import updateOptions from './updateOptions';
import composableSettings from './composableSettings';
import setAdminEdits from './setAdminEdits';

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
    mergeAddedMultiSectionData,
    setMainInputSelection,
    setTextInputItemValue,
    setOneActionNoteItemValue,
    setItemsInspectorNote,
    setMainInputItemSelected,
    setOneActionNoteItemSelected,
    setIsItemNA,
    setSignature,
    mergeExistingPhotoData,
    addPhotoData,
    removePhotoData,
    setAdminEdits,
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

// Merge local data from an added
// multi-section item that has not
// been published yet
const mergeAddedMultiSectionData = (
  result: inspectionTemplateItemModel,
  settings: composableSettings
): inspectionTemplateItemModel => {
  const { updatedItem } = settings;

  // Normally an item's title is never added to the publishable updates
  // because it cannot be updated, however locally added multi-section
  // items do have a cloned title that does need to be published. So
  // it's used here to detect a multi-section item
  const hasAddedMultiSectionAttr = Boolean(updatedItem.title);

  if (hasAddedMultiSectionAttr) {
    Object.assign(result, JSON.parse(JSON.stringify(updatedItem)));
  }

  return result;
};

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
  const isOneActionNote =
    isMainInputItem && getMainItemType(currentItem) === 'oneaction_notes';

  // Ignore one action notes
  // that have no selection index
  if (isOneActionNote) {
    return result;
  }

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
  const value = `${userChanges.textInputValue || ''}`.trim();
  const isDifferentThanCurrent = value !== currentItem.textInputValue;

  // Provide previous update
  if (!isChanging && hasPreviousUpdate) {
    result.textInputValue = updatedItem.textInputValue;
  }

  // Add user change to updates
  if (isChanging && isTextInputItem && isDifferentThanCurrent) {
    result.textInputValue = value;
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
  const isDifferentThanCurrent = value !== (currentItem.mainInputNotes || '');

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

// Add/remove a signature to/from an item
const setSignature = (
  result: inspectionTemplateItemModel,
  settings: composableSettings
): inspectionTemplateItemModel => {
  const { userChanges, currentItem, updatedItem } = settings;
  const isChanging = typeof userChanges.signatureDownloadURL === 'string';
  const isDifferentThanCurrent =
    userChanges.signatureDownloadURL !== currentItem.signatureDownloadURL;
  const hasPreviousUpdate =
    typeof updatedItem.signatureDownloadURL === 'string';

  // Provide previous update
  if (!isChanging && hasPreviousUpdate) {
    result.signatureDownloadURL = updatedItem.signatureDownloadURL;

    // Also add any timestamp key
    if (updatedItem.signatureTimestampKey) {
      result.signatureTimestampKey = updatedItem.signatureTimestampKey;
    }
  }

  // Add user unselected change to updates
  if (isChanging && isDifferentThanCurrent) {
    result.signatureDownloadURL = userChanges.signatureDownloadURL;
    result.signatureTimestampKey = `${Math.round(Date.now() / 1000)}`;
  } else if (isChanging) {
    delete result.signatureDownloadURL;
    delete result.signatureTimestampKey;
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
  const { userChanges } = settings;
  const hasPhotoDataUpdates = typeof userChanges.photosData !== 'undefined';
  const [photoDataId, photoDataUpdate] = hasPhotoDataUpdates
    ? Object.entries(userChanges.photosData)[0] || []
    : [];
  const isAddingPhoto = Boolean(photoDataUpdate);

  if (!isAddingPhoto) {
    return result;
  }

  // Append photo data entry
  result.photosData = result.photosData || {};
  result.photosData[photoDataId] = {
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

  // Title used to detect locally added multi-section
  // see notes in `mergeAddedMultiSectionData` for more
  // details about why
  const isAddedMultiSection = Boolean(result.title);
  const isCurrentlyAdded = Boolean((currentItem.photosData || {})[photoId]);
  const isLocallyAdded = Boolean((updatedItem.photosData || {})[photoId]);

  if (!isAddedMultiSection && isCurrentlyAdded) {
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
