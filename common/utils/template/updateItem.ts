import pipe from '../pipe';
import TemplateModel from '../../models/template';
import TemplateItemModel from '../../models/inspectionTemplateItem';
import { ComposableItemSettings, UserItemChanges } from './composableSettings';
import { uuid } from '../uuidv4';
import inspectionConfig from '../../../config/inspections';
import updateIndexes, {
  removeAtIndex,
  mergeIndexedRecords
} from './updateIndexes';
import deepClone from '../deepClone';

const INSPECTION_SCORES = inspectionConfig.inspectionScores;
const ITEM_VALUES_KEYS = inspectionConfig.itemValuesKeys;
const SCORE_ATTRIBUTES = [
  'mainInputZeroValue',
  'mainInputOneValue',
  'mainInputTwoValue',
  'mainInputThreeValue',
  'mainInputFourValue'
];

// Manage local updates for template's general settings
export default function updateItem(
  updatedTemplate: TemplateModel,
  currentTemplate: TemplateModel,
  userChanges: UserItemChanges,
  targetId: string
): TemplateModel {
  return pipe(
    mergePreviousUpdates,
    setAddedItem,
    setItemType,
    setItemMainInputType,
    setTitle,
    setPhotosValue,
    setNotesValue,
    setScore,
    setItemIndex,
    setRemovedItem,
    clearEmptyItems
  )(
    {} as TemplateModel, // result
    {
      updatedTemplate,
      currentTemplate,
      userChanges,
      targetId
    } as ComposableItemSettings
  );
}

// Merge any prior updates
// into the final results
const mergePreviousUpdates = (
  result: TemplateModel,
  settings: ComposableItemSettings
) => {
  const { updatedTemplate } = settings;
  result.items = {};

  if (updatedTemplate) {
    result = deepClone(updatedTemplate); // eslint-disable-line no-param-reassign
    result.items = deepClone(updatedTemplate.items || {});
  }

  return result;
};

// Add new item into template items update
const setAddedItem = (
  result: TemplateModel,
  settings: ComposableItemSettings
) => {
  const { userChanges, currentTemplate, updatedTemplate, targetId } = settings;
  const isAddingItem =
    userChanges &&
    targetId === 'new' &&
    Boolean(userChanges?.sectionId) &&
    Boolean(userChanges?.itemType);
  const currentItems = currentTemplate.items || {};
  const previousItems = updatedTemplate.items || {};

  if (isAddingItem) {
    const item = createItem(userChanges?.itemType);
    item.id = uuid(20);
    item.sectionId = userChanges.sectionId;
    item.index = createNextItemIndex(
      userChanges.sectionId,
      currentItems,
      previousItems
    );
    result.items = result.items || {};
    result.items[item.id] = item;
  }

  return result;
};

const setItemType = (
  result: TemplateModel,
  settings: ComposableItemSettings
) => {
  const { userChanges, currentTemplate, updatedTemplate, targetId } = settings;
  const isChanging =
    typeof userChanges?.itemType === 'string' && targetId !== 'new';
  const currentItems = currentTemplate.items || {};
  const currentItem = currentItems[targetId] || {};
  const previousItems = updatedTemplate.items || {};
  const value = userChanges?.itemType;
  const isDifferentThanCurrent = value !== currentItem.itemType;

  if (!isChanging) {
    return result;
  }

  const previousItem = previousItems[targetId] || {};
  const { index, sectionId, title } = previousItem;
  const itemUpdates = createItem(value);

  if (index) {
    itemUpdates.index = index;
  }
  if (sectionId) {
    itemUpdates.sectionId = sectionId;
  }
  if (title) {
    itemUpdates.title = title;
  }

  result.items[targetId] = itemUpdates;

  // Remove undifferentiated change from updates
  if (!isDifferentThanCurrent) {
    delete result.items[targetId].itemType;
  }

  return result;
};

const setItemMainInputType = (
  result: TemplateModel,
  settings: ComposableItemSettings
) => {
  const { userChanges, currentTemplate, updatedTemplate, targetId } = settings;
  const isChanging = typeof userChanges?.mainInputType === 'string';
  const currentItems = currentTemplate.items || {};
  const previousItems = updatedTemplate.items || {};
  const value = userChanges?.mainInputType;

  if (!isChanging) {
    return result;
  }

  const itemType = previousItems[targetId]?.itemType || currentItems[targetId]?.itemType  || '';

  // Do not update non-main types
  if (`${itemType}`.toLowerCase() !== 'main') {
    return result;
  }

  // Add user change to updates
  const itemValues = createItemValues(value);
  const updatedItem = {
    ...result.items[targetId],
    ...itemValues,
    mainInputType: value
  };

  result.items[targetId] = updatedItem;

  return result;
};

// Set template item title
const setTitle = (result: TemplateModel, settings: ComposableItemSettings) => {
  const { userChanges, currentTemplate, targetId } = settings;
  const currentItem = (currentTemplate.items || {})[targetId] || {};
  const isChanging = typeof userChanges?.title === 'string';
  const value = `${userChanges?.title || ''}`.trim();
  const isDifferentThanCurrent = value !== currentItem.title;

  if (!isChanging) {
    return result;
  }

  // Add publishable changes
  // or remove local only updates
  if (isDifferentThanCurrent) {
    result.items[targetId] =
      result.items[targetId] || ({} as TemplateItemModel);
    result.items[targetId].title = value;
  } else if (result.items[targetId]) {
    delete result.items[targetId].title;
  }

  return result;
};

// Set template item photos value
const setPhotosValue = (
  result: TemplateModel,
  settings: ComposableItemSettings
) => {
  const { userChanges, currentTemplate, targetId } = settings;
  const currentItem = (currentTemplate.items || {})[targetId] || {};
  const isChanging = typeof userChanges?.photos === 'boolean';
  const value = userChanges?.photos;
  const isDifferentThanCurrent = value !== currentItem.photos;

  if (!isChanging) {
    return result;
  }

  // Add publishable changes
  // or remove local only updates
  if (isDifferentThanCurrent) {
    result.items[targetId] =
      result.items[targetId] || ({} as TemplateItemModel);
    result.items[targetId].photos = value;
  } else if (result.items[targetId]) {
    delete result.items[targetId].photos;
  }

  return result;
};

// Set template item notes value
const setNotesValue = (
  result: TemplateModel,
  settings: ComposableItemSettings
) => {
  const { userChanges, currentTemplate, targetId } = settings;
  const currentItem = (currentTemplate.items || {})[targetId] || {};
  const isChanging = typeof userChanges?.notes === 'boolean';
  const value = userChanges?.notes;
  const isDifferentThanCurrent = value !== currentItem.notes;

  if (!isChanging) {
    return result;
  }

  // Add publishable changes
  // or remove local only updates
  if (isDifferentThanCurrent) {
    result.items[targetId] =
      result.items[targetId] || ({} as TemplateItemModel);
    result.items[targetId].notes = value;
  } else if (result.items[targetId]) {
    delete result.items[targetId].notes;
  }

  return result;
};

// Set custom template item score value
const setScore = (result: TemplateModel, settings: ComposableItemSettings) => {
  const { userChanges, currentTemplate, targetId } = settings;
  const currentItem = (currentTemplate.items || {})[targetId] || {};
  const [updateAttrName] = Object.keys(userChanges || {});
  const isChanging = SCORE_ATTRIBUTES.includes(updateAttrName);
  const value = (userChanges || {})[updateAttrName];

  if (!isChanging || typeof value !== 'number') {
    return result;
  }

  const isDifferentThanCurrent = value !== currentItem[updateAttrName];

  // Add user change to updates
  if (isDifferentThanCurrent) {
    result.items[targetId] =
      result.items[targetId] || ({} as TemplateItemModel);
    result.items[targetId][updateAttrName] = value;
  } else if (result.items[targetId]) {
    delete result.items[targetId][updateAttrName];
  }

  return result;
};

// Set template item index
const setItemIndex = (
  result: TemplateModel,
  settings: ComposableItemSettings
) => {
  const { userChanges, currentTemplate, updatedTemplate, targetId } = settings;
  const isChanging =
    targetId && targetId !== 'new' && typeof userChanges?.index === 'number';

  if (!isChanging) {
    return result;
  }

  // Update item indexes
  const targetSectionId = findSectionId(
    targetId,
    updatedTemplate.items,
    currentTemplate.items
  );
  const currentItems = reduceItemsToSection(
    targetSectionId,
    deepClone(currentTemplate.items || {})
  );
  const previousItems = deepClone(updatedTemplate.items || {});
  const mergedIndexes = mergeIndexedRecords(currentItems, previousItems);
  const updatedIndexes = updateIndexes(
    mergedIndexes,
    userChanges.index,
    targetId
  );

  // Merge all index updates into results
  Object.keys(updatedIndexes).forEach((id) => {
    const newIndex = updatedIndexes[id].index;
    const currentIndex = (currentItems[id] || {}).index;
    const previousIndex = (previousItems[id] || {}).index;

    // Update item index
    if (newIndex !== previousIndex) {
      result.items[id] = result.items[id] || ({} as TemplateItemModel);
      result.items[id].index = newIndex;
    }

    // Remove index matching current
    if (result.items[id] && result.items[id].index === currentIndex) {
      delete result.items[id].index;
    }
  });

  return result;
};

// Remove item from template updates
const setRemovedItem = (
  result: TemplateModel,
  settings: ComposableItemSettings
) => {
  const { userChanges, currentTemplate, updatedTemplate, targetId } = settings;
  const isRemovingItem = userChanges === null;

  if (!isRemovingItem) {
    return result;
  }

  // Update item indexes
  const targetSectionId = findSectionId(
    targetId,
    updatedTemplate.items,
    currentTemplate.items
  );
  const currentItems = reduceItemsToSection(
    targetSectionId,
    deepClone(currentTemplate.items || {})
  );
  const previousItems = deepClone(updatedTemplate.items || {});
  const mergedIndexes = mergeIndexedRecords(currentItems, previousItems);
  const removeTargetIndex = mergedIndexes[targetId].index;

  // Item delete update
  if (currentItems[targetId]) {
    result.items[targetId] = null; // publish removal
  } else {
    delete result.items[targetId]; // delete local update only
  }

  // Decrement item indexes
  const updatedIndexes = removeAtIndex(mergedIndexes, removeTargetIndex);

  // Merge indirectly updated item
  // indexes into results
  Object.keys(updatedIndexes).forEach((id) => {
    const newIndex = updatedIndexes[id].index;
    const currentIndex = (currentItems[id] || {}).index;
    const previousIndex = (previousItems[id] || {}).index;

    // Update item index
    if (newIndex !== previousIndex) {
      result.items[id] = result.items[id] || ({} as TemplateItemModel);
      result.items[id].index = newIndex;
    }

    // Remove index matching current (remote) state
    if (result.items[id] && result.items[id].index === currentIndex) {
      delete result.items[id].index;
    }
  });

  return result;
};

const clearEmptyItems = (result: TemplateModel) => {
  Object.keys(result.items || {}).forEach((id) => {
    if (
      result.items[id] !== null && // keep publishable deletes
      Object.keys(result.items[id]).length === 0
    ) {
      delete result.items[id];
    }
  });

  return result;
};

const createItemValues = (type: string) => {
  const itemType = typeof type === 'string' ? `${type}`.toLowerCase() : type;
  const scores = INSPECTION_SCORES[itemType];
  const itemValues = Object.create(null);

  if (!scores) {
    return null;
  }

  /*
   * Set `mainInput<key-value>Value` = score for each score
   */
  scores.forEach((score, index) => {
    itemValues[`mainInput${ITEM_VALUES_KEYS[index]}Value`] = scores[index];
  });

  return itemValues;
};

const createItem = (
  itemType: string,
  mainInputType = 'twoactions_checkmarkx'
) => {
  const item = {} as TemplateItemModel;
  const scoreValues =
    createItemValues(itemType) || createItemValues(mainInputType);

  if (scoreValues) {
    Object.assign(item, scoreValues); // set any item score values
  }

  // Set common item properties
  item.itemType = itemType;

  if (itemType === 'main') {
    item.mainInputType = mainInputType;
    item.photos = true;
    item.notes = true;
  }

  return item;
};

// Create an item idex for a section
// group, returning next index in group
// or zero for a first section item
const createNextItemIndex = (
  sectionId: string,
  currentItems: Record<string, TemplateItemModel>,
  previousItems: Record<string, TemplateItemModel>
): number => {
  const itemIds = [...Object.keys(currentItems), ...Object.keys(previousItems)];

  const lastItemIndex = itemIds
    // Unique item identifiers only
    .filter((id, i, arr) => arr.indexOf(id) === i)
    // Find only items within section group
    .filter((id) => {
      const itemsSectionId =
        previousItems[id]?.sectionId || currentItems[id]?.sectionId;
      return itemsSectionId === sectionId;
    })
    // Create array of all item indexes
    .reduce((acc, id) => {
      // Use local updates over remove
      const { index } = previousItems[id] || currentItems[id];

      // If valid index number, non NaN
      // eslint-disable-next-line no-self-compare
      if (typeof index === 'number' && index === index) {
        acc.push(index);
      }

      return acc;
    }, [])
    .sort((a, b) => a - b) // sort ascending
    .pop();

  // Return 0 when last index unfound
  // otherwise increment last index by 1
  return typeof lastItemIndex === 'undefined' ? 0 : lastItemIndex + 1;
};

// Find an items section ID
// in either a priority A or
// priority B data set
function findSectionId(
  id: string,
  priorityA: Record<string, TemplateItemModel>,
  priorityB: Record<string, TemplateItemModel>
): string {
  const foundA = ((priorityA || {})[id] || {}).sectionId || '';
  const foundB = ((priorityB || {})[id] || {}).sectionId || '';
  return foundA || foundB;
}

// Create items group belonging to only
// a single, specified, section
function reduceItemsToSection(
  sectionId: string,
  items: Record<string, TemplateItemModel>
): Record<string, TemplateItemModel> {
  return Object.keys(items).reduce((acc, id) => {
    if (acc[id].sectionId !== sectionId) {
      delete acc[id];
    }
    return acc;
  }, deepClone(items || {}) as Record<string, TemplateItemModel>);
}
