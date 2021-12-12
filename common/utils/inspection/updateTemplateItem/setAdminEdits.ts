import pipe from '../../pipe';
import uuid from '../../uuidv4'; // eslint-disable-line
import string from '../../string';
import updateOptions from './updateOptions';
import composableSettings from './composableSettings';
import inspectionConfig from '../../../../config/inspections';
import inspectionTemplateItemModel from '../../../models/inspectionTemplateItem';
import adminEditModel from '../../../models/inspectionTemplateItemAdminEdit';

const ACTIONS_REG_EXP = {
  inspectorNotes: /updated creator notes/,
  mainInputNotes: /updated main notes/,
  signatureDownloadURL: /signature photo added with filename: (.)+/,
  textInputValue: /updated main text/,
  mainInputSelection:
    /(selected|unselected) (main input|checkmark|X|thumbsup|thumbsdown|exclamation|A|B|C|1|2|3|4|5)/,
  isItemNA: /(set item to NA|added item back from being set NA)/g,
  photosData: /(added|deleted) photo with filename: (.)+/
};

const { inspectionValueNames: ITEM_SELECTION_NAMES } = inspectionConfig;

type adminEditsModel = Record<string, adminEditModel>;

// Set admin edits for all updates
export default function setAdminEdits(
  result: inspectionTemplateItemModel,
  settings: composableSettings
): inspectionTemplateItemModel {
  // Return immediately when admin edits disabled
  if (!settings.options.adminEdit) {
    return result;
  }

  // Apply admin edits
  return pipe(
    setInspectorNotesAdminEdit,
    setOneActionNoteItemAdminEdit,
    setSignatureAdminEdit,
    setTextInputItemValueAdminEdit,
    setMainInputSelectionAdminEdits,
    setIsItemNAAdminEdits,
    mergeExistingPhotoDataAdminEdits,
    setPhotoDataAdminEdits,
    removeUnupdatedAdminEdits
  )(
    result, // result
    settings
  );
}

// Set admin edit for inspection note update
function setInspectorNotesAdminEdit(
  result: inspectionTemplateItemModel,
  settings: composableSettings
): inspectionTemplateItemModel {
  const { updatedItem, userChanges, options } = settings;
  const isChanging = typeof userChanges.inspectorNotes === 'string';
  const isDifferentThanCurrent = typeof result.inspectorNotes !== 'undefined';
  const [entryId, previousEntry] = findAdminEdit(
    ACTIONS_REG_EXP.inspectorNotes,
    updatedItem.adminEdits
  );
  const hasPreviousEntry = Boolean(previousEntry);

  // Provide previous update
  if (!isChanging && hasPreviousEntry) {
    result.adminEdits = result.adminEdits || {};
    result.adminEdits[entryId] = copyEntry(previousEntry);
    delete result.adminEdits[entryId].id; // sanity check
  } else if (isChanging && isDifferentThanCurrent && !previousEntry) {
    // Add new admin edit
    result.adminEdits = result.adminEdits || {};
    result.adminEdits[uuid(20)] = createAdminEditEntry(
      'updated creator notes',
      options
    );
  } else if (!isDifferentThanCurrent && hasPreviousEntry && result.adminEdits) {
    // Remove no longer applicable admin edit
    delete result.adminEdits[entryId];
  }

  return result;
}

// Set admin edit entry for one action
// note item updates
function setOneActionNoteItemAdminEdit(
  result: inspectionTemplateItemModel,
  settings: composableSettings
): inspectionTemplateItemModel {
  const { updatedItem, userChanges, options } = settings;
  const isChanging = typeof userChanges.mainInputNotes === 'string';
  const isDifferentThanCurrent = typeof result.mainInputNotes !== 'undefined';
  const [entryId, previousEntry] = findAdminEdit(
    ACTIONS_REG_EXP.mainInputNotes,
    updatedItem.adminEdits
  );
  const hasPreviousEntry = Boolean(previousEntry);

  // Provide previous update
  if (!isChanging && hasPreviousEntry) {
    result.adminEdits = result.adminEdits || {};
    result.adminEdits[entryId] = copyEntry(previousEntry);
  } else if (isChanging && isDifferentThanCurrent && !previousEntry) {
    // Add new admin edit
    result.adminEdits = result.adminEdits || {};
    result.adminEdits[uuid(20)] = createAdminEditEntry(
      'updated main notes',
      options
    );
  } else if (!isDifferentThanCurrent && hasPreviousEntry && result.adminEdits) {
    // Remove no longer applicable admin edit
    delete result.adminEdits[entryId];
  }

  return result;
}

// Set admin edit entry for signature updates
function setSignatureAdminEdit(
  result: inspectionTemplateItemModel,
  settings: composableSettings
): inspectionTemplateItemModel {
  const { updatedItem, userChanges, options } = settings;
  const isChanging = typeof userChanges.signatureDownloadURL === 'string';
  const isDifferentThanCurrent =
    typeof result.signatureDownloadURL !== 'undefined';
  const [entryId, previousEntry] = findAdminEdit(
    ACTIONS_REG_EXP.signatureDownloadURL,
    updatedItem.adminEdits
  );
  const hasPreviousEntry = Boolean(previousEntry);

  // Provide previous update
  if (!isChanging && hasPreviousEntry) {
    result.adminEdits = result.adminEdits || {};
    result.adminEdits[entryId] = copyEntry(previousEntry);
  } else if (isChanging && isDifferentThanCurrent && !previousEntry) {
    // Add new admin edit
    result.adminEdits = result.adminEdits || {};
    result.adminEdits[uuid(20)] = createAdminEditEntry(
      `signature photo added with filename: ${result.signatureTimestampKey}.png`,
      options
    );
  } else if (!isDifferentThanCurrent && hasPreviousEntry && result.adminEdits) {
    // Remove no longer applicable admin edit
    delete result.adminEdits[entryId];
  }

  return result;
}

// Set admin edit entry for text input item updates
function setTextInputItemValueAdminEdit(
  result: inspectionTemplateItemModel,
  settings: composableSettings
): inspectionTemplateItemModel {
  const { updatedItem, userChanges, options } = settings;
  const isChanging = typeof userChanges.textInputValue === 'string';
  const isDifferentThanCurrent = typeof result.textInputValue !== 'undefined';
  const [entryId, previousEntry] = findAdminEdit(
    ACTIONS_REG_EXP.textInputValue,
    updatedItem.adminEdits
  );
  const hasPreviousEntry = Boolean(previousEntry);

  // Provide previous update
  if (!isChanging && hasPreviousEntry) {
    result.adminEdits = result.adminEdits || {};
    result.adminEdits[entryId] = copyEntry(previousEntry);
  } else if (isChanging && isDifferentThanCurrent && !previousEntry) {
    // Add new admin edit
    result.adminEdits = result.adminEdits || {};
    result.adminEdits[uuid(20)] = createAdminEditEntry(
      'updated main text',
      options
    );
  } else if (!isDifferentThanCurrent && hasPreviousEntry && result.adminEdits) {
    // Remove no longer applicable admin edit
    delete result.adminEdits[entryId];
  }

  return result;
}

// Set the selected and unselected main input
// items admin edit entries
function setMainInputSelectionAdminEdits(
  result: inspectionTemplateItemModel,
  settings: composableSettings
): inspectionTemplateItemModel {
  const { updatedItem, currentItem, userChanges, options } = settings;
  const isChanging = typeof userChanges.mainInputSelection === 'number';
  const isDifferentThanCurrent =
    typeof result.mainInputSelection !== 'undefined';
  const isSelected = isDifferentThanCurrent && result.mainInputSelection > -1;
  const [entryId, previousEntry] = findAdminEdit(
    ACTIONS_REG_EXP.mainInputSelection,
    updatedItem.adminEdits
  );
  const hasPreviousEntry = Boolean(previousEntry);
  const itemType = `${currentItem.mainInputType || ''}`.toLowerCase();

  // Provide previous update
  if (!isChanging && hasPreviousEntry) {
    result.adminEdits = result.adminEdits || {};
    result.adminEdits[entryId] = copyEntry(previousEntry);
  } else if (isChanging && isDifferentThanCurrent && !previousEntry) {
    // Add new admin edit
    const action = isSelected
      ? `selected ${ITEM_SELECTION_NAMES[itemType][result.mainInputSelection]}`
      : 'unselected main input';
    result.adminEdits = result.adminEdits || {};
    result.adminEdits[uuid(20)] = createAdminEditEntry(action, options);
  } else if (!isDifferentThanCurrent && hasPreviousEntry && result.adminEdits) {
    // Remove no longer applicable admin edit
    delete result.adminEdits[entryId];
  }

  return result;
}

// Set the applicable/inapplicabl
// items admin edit entries
function setIsItemNAAdminEdits(
  result: inspectionTemplateItemModel,
  settings: composableSettings
): inspectionTemplateItemModel {
  const { updatedItem, userChanges, options } = settings;
  const isChanging = typeof userChanges.isItemNA === 'boolean';
  const isDifferentThanCurrent = typeof result.isItemNA !== 'undefined';
  const isNotApplicable = isDifferentThanCurrent && result.isItemNA;
  const [entryId, previousEntry] = findAdminEdit(
    ACTIONS_REG_EXP.isItemNA,
    updatedItem.adminEdits
  );
  const hasPreviousEntry = Boolean(previousEntry);

  // Provide previous update
  if (!isChanging && hasPreviousEntry) {
    result.adminEdits = result.adminEdits || {};
    result.adminEdits[entryId] = copyEntry(previousEntry);
  } else if (isChanging && isDifferentThanCurrent && !previousEntry) {
    // Add new admin edit
    const action = isNotApplicable
      ? 'set item to NA'
      : 'added item back from being set NA';
    result.adminEdits = result.adminEdits || {};
    result.adminEdits[uuid(20)] = createAdminEditEntry(action, options);
  } else if (!isDifferentThanCurrent && hasPreviousEntry && result.adminEdits) {
    // Remove no longer applicable admin edit
    delete result.adminEdits[entryId];
  }

  return result;
}

// Add any previous admin edits for photo data updates
function mergeExistingPhotoDataAdminEdits(
  result: inspectionTemplateItemModel,
  settings: composableSettings
): inspectionTemplateItemModel {
  const { updatedItem } = settings;
  const adminEdits = updatedItem.adminEdits || {};
  const entries = Object.entries(adminEdits);
  const photoEntries = entries.filter(
    ([, { action }]) => action.search(ACTIONS_REG_EXP.photosData) > -1
  );
  const hasPreviousPhotoEntries = photoEntries.length > 0;

  if (hasPreviousPhotoEntries) {
    result.adminEdits = result.adminEdits || {};
    JSON.parse(JSON.stringify(updatedItem.photosData));

    // Clone and readd to admin edits
    photoEntries.forEach(([id, photoEntry]) => {
      const cloned = { ...photoEntry } as adminEditModel;
      delete cloned.id; // sanity check;
      result.adminEdits[id] = cloned;
    });
  }

  return result;
}

// Append an add or remove photo
// data admin edit entry
function setPhotoDataAdminEdits(
  result: inspectionTemplateItemModel,
  settings: composableSettings
): inspectionTemplateItemModel {
  const { updatedItem, currentItem, userChanges, options } = settings;
  const previousPhotoDataAdminEdits = Object.entries(
    result.adminEdits || {}
  ).filter(([, { action }]) => action.search(ACTIONS_REG_EXP.photosData) > -1);
  const isChanging = typeof userChanges.photosData !== 'undefined';
  const removePhotoDataUpdateId =
    Object.keys(userChanges.photosData || {})[0] || '';
  const isRemovingPhoto =
    (result.photosData || {})[removePhotoDataUpdateId] === null;
  const isAddingPhoto =
    getAddPhotoDataIds(result.photosData).length >
    getAddPhotoDataIds(updatedItem.photosData).length;
  const photoDataUpdateId = isAddingPhoto
    ? findDiffId(result.photosData, updatedItem.photosData)
    : removePhotoDataUpdateId;
  const photoDataUpdate =
    (result.photosData || {})[photoDataUpdateId] ||
    (updatedItem.photosData || {})[photoDataUpdateId] ||
    (currentItem.photosData || {})[photoDataUpdateId] ||
    null;

  const caption = string.truncate(
    photoDataUpdate ? photoDataUpdate.caption || '' : '',
    60,
    '...'
  );
  const downloadUrl = photoDataUpdate ? photoDataUpdate.downloadURL || '' : '';
  const fileType = (
    downloadUrl
      .replace(/\?(.)+$/, '')
      .split('.')
      .pop() || 'jpg'
  )
    .replace('jpeg', 'jpg')
    .trim();
  const filename = `${photoDataUpdateId.trim()}.${fileType}`;
  const addAction = `added photo with filename: ${filename}${
    caption ? ', and caption: ' : ''
  }${caption}`;
  const removeAction = `deleted photo with filename: ${filename}`;
  const previousAddEntry = previousPhotoDataAdminEdits.find(
    ([, { action }]) => action === addAction
  );
  const previousRemoveEntry = previousPhotoDataAdminEdits.find(
    ([, { action }]) => action === removeAction
  );

  if (isChanging && isAddingPhoto) {
    // Adding photo data added admin edit
    result.adminEdits = result.adminEdits || {};
    result.adminEdits[uuid(20)] = createAdminEditEntry(addAction, options);
  } else if (isChanging && isRemovingPhoto) {
    // Adding photo data remove admin edit
    result.adminEdits = result.adminEdits || {};
    result.adminEdits[uuid(20)] = createAdminEditEntry(removeAction, options);
  }

  // Remove no longer applicable add admin edit
  if (
    isChanging &&
    !isAddingPhoto &&
    Boolean(previousAddEntry) &&
    result.adminEdits
  ) {
    delete result.adminEdits[previousAddEntry[0]];
  }

  // Remove no longer applicable remove admin edit
  if (
    isChanging &&
    !isRemovingPhoto &&
    Boolean(previousRemoveEntry) &&
    result.adminEdits
  ) {
    delete result.adminEdits[previousRemoveEntry[0]];
  }

  return result;
}

// Remove empty admin edits from local updates
const removeUnupdatedAdminEdits = (
  result: inspectionTemplateItemModel
): inspectionTemplateItemModel => {
  const hasNoUpdates = Object.keys(result.adminEdits || {}).length === 0;

  if (hasNoUpdates) {
    delete result.adminEdits;
  }

  return result;
};

// Find an admin edit entry
// by querying the action string
function findAdminEdit(
  query: RegExp,
  adminEdits?: adminEditsModel
): [string?, adminEditModel?] {
  const entries = Object.entries(adminEdits || {});

  return (
    entries.find(([, adminEdit]) => adminEdit.action.search(query) > -1) || []
  );
}

// Create a new admin edit entry
// for a given action string
function createAdminEditEntry(
  action: string,
  options: updateOptions
): adminEditModel {
  return {
    action,
    admin_name: options.adminFullName || '',
    admin_uid: options.adminId || '',
    edit_date: Math.round(Date.now() / 1000)
  };
}

// Clone and normalize an admin edit entry
function copyEntry(adminEditEntry: adminEditModel): adminEditModel {
  const result = { ...adminEditEntry } as adminEditModel; // clone
  delete result.id; // sanity check
  return result;
}

// Find the first different ID a that does not
// exist in b's object hash
function findDiffId(a?: any, b?: any): string {
  const aIds = Object.keys(a || {});
  const bIds = Object.keys(b || {});
  return aIds.find((id) => !bIds.includes(id)) || '';
}

// Collect all hash ids that map to truthey values
function getAddPhotoDataIds(obj: any): string[] {
  return Object.keys(obj || {}).filter((id) => Boolean(obj[id]));
}
