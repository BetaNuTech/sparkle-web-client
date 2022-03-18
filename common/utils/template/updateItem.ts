import pipe from '../pipe';
import TemplateModel from '../../models/template';
import TemplateItemModel from '../../models/inspectionTemplateItem';
import { ComposableItemSettings, UserItemChanges } from './composableSettings';
import { uuid } from '../uuidv4';
import inspectionConfig from '../../../config/inspections';
import updateIndexes from './updateIndexes';
import deepmerge from '../deepmerge';
import deepClone from '../deepClone';

const INSPECTION_SCORES = inspectionConfig.inspectionScores;

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
    clearEmptyItem
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

  if (!updatedTemplate) return result;

  result = deepClone(updatedTemplate); // eslint-disable-line no-param-reassign
  result.items = deepClone(updatedTemplate.items || {});

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
  if (!isAddingItem) {
    return result;
  }

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
  return result;
};

const setItemType = (
  result: TemplateModel,
  settings: ComposableItemSettings
) => {
  const { userChanges, currentTemplate, updatedTemplate, targetId } = settings;
  const isChangingItem =
    typeof userChanges?.itemType === 'string' && targetId !== 'new';
  const currentItems = currentTemplate.items || {};
  const targetedItem = currentItems[targetId] || {};
  const previousItems = updatedTemplate.items || {};
  const value = userChanges?.itemType;
  const isDifferentThanCurrent = value !== targetedItem.itemType;

  if (!isChangingItem) {
    return result;
  }

  const item = previousItems[targetId] || {};
  const { index, sectionId, title } = item;

  const updatedItem = createItem(value);

  if (index) {
    updatedItem.index = index;
  }
  if (sectionId) {
    updatedItem.sectionId = sectionId;
  }
  if (title) {
    updatedItem.title = title;
  }

  result.items[targetId] = updatedItem;

  // Remove undifferentiated change from updates
  if (isChangingItem && !isDifferentThanCurrent) {
    delete ((result.items || {})[targetId] || {}).itemType;
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

  const item = previousItems[targetId] || currentItems[targetId] || {};

  if (item.itemType === 'signature' || item.itemType === 'text_input') {
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
  const targetedItem = (currentTemplate.items || {})[targetId] || {};

  const isChanging = typeof userChanges.title === 'string';
  const value = `${userChanges.title || ''}`.trim();
  const isDifferentThanCurrent = value !== targetedItem.title;

  // Add user change to updates
  if (isChanging && isDifferentThanCurrent) {
    result.items[targetId] = { ...result.items[targetId], title: value };
  }

  // Remove undifferentiated change from updates
  if (isChanging && !isDifferentThanCurrent) {
    delete ((result.items || {})[targetId] || {}).title;
  }

  return result;
};

// Set template item photos value
const setPhotosValue = (
  result: TemplateModel,
  settings: ComposableItemSettings
) => {
  const { userChanges, currentTemplate, targetId } = settings;

  const targetedItem = (currentTemplate.items || {})[targetId] || {};

  const isChanging = typeof userChanges.photos === 'boolean';
  const value = userChanges.photos;
  const isDifferentThanCurrent = value !== targetedItem.photos;

  // Add user change to updates
  if (isChanging && isDifferentThanCurrent) {
    result.items[targetId] = { ...result.items[targetId], photos: value };
  }

  // Remove undifferentiated change from updates
  if (isChanging && !isDifferentThanCurrent) {
    delete ((result.items || {})[targetId] || {}).photos;
  }

  return result;
};

// Set template item notes value
const setNotesValue = (
  result: TemplateModel,
  settings: ComposableItemSettings
) => {
  const { userChanges, currentTemplate, targetId } = settings;

  const targetedItem = (currentTemplate.items || {})[targetId] || {};

  const isChanging = typeof userChanges.notes === 'boolean';
  const value = userChanges.notes;
  const isDifferentThanCurrent = value !== targetedItem.notes;

  // Add user change to updates
  if (isChanging && isDifferentThanCurrent) {
    result.items[targetId] = { ...result.items[targetId], notes: value };
  }

  // Remove undifferentiated change from updates
  if (isChanging && !isDifferentThanCurrent) {
    delete ((result.items || {})[targetId] || {}).notes;
  }

  return result;
};

// Set template item score value
const setScore = (result: TemplateModel, settings: ComposableItemSettings) => {
  const { userChanges, currentTemplate, targetId } = settings;

  const targetedItem = (currentTemplate.items || {})[targetId] || {};

  const [updatedValueKey] = Object.keys(userChanges);
  const valueKeys = [
    'mainInputZeroValue',
    'mainInputOneValue',
    'mainInputTwoValue',
    'mainInputThreeValue',
    'mainInputFourValue'
  ];

  if (!valueKeys.some((keys) => keys === updatedValueKey)) {
    return result;
  }

  const isChanging = typeof userChanges[updatedValueKey] === 'number';
  const value = userChanges[updatedValueKey];
  const isDifferentThanCurrent = value !== targetedItem[updatedValueKey];

  // Add user change to updates
  if (isChanging && isDifferentThanCurrent) {
    result.items[targetId] = {
      ...result.items[targetId],
      [updatedValueKey]: value
    };
  }

  // Remove undifferentiated change from updates
  if (isChanging && !isDifferentThanCurrent) {
    delete ((result.items || {})[targetId] || {})[updatedValueKey];
  }

  return result;
};

// Set template item index
const setItemIndex = (
  result: TemplateModel,
  settings: ComposableItemSettings
) => {
  const { userChanges, currentTemplate, updatedTemplate, targetId } = settings;

  const items = currentTemplate.items || {};
  const previousItems = updatedTemplate.items || {};

  const isChanging = targetId && typeof userChanges?.index === 'number';
  if (!isChanging) {
    return result;
  }

  const value = userChanges?.index;

  // Add user change to updates
  if (isChanging) {
    result.items = {
      ...(result.items || {}),
      [targetId]: { ...(result.items || {})[targetId], index: value }
    };

    // update item indexes
    const mergedItems = deepmerge(items, previousItems);
    const updatedTemplates = updateIndexes(mergedItems, value, targetId);

    // Merge item index updates into results
    Object.keys(updatedTemplates).forEach((id) => {
      result.items[id] = result.items[id] || ({} as TemplateItemModel); // setup
      const resultItem = result.items[id];
      const updatedItem = updatedTemplates[id];
      const currentItemIndex = (items[id] || {}).index;

      // Update item index
      if (resultItem.index !== updatedItem.index) {
        resultItem.index = updatedItem.index;
      }
      // Remove index matching current
      if (resultItem.index === currentItemIndex) {
        delete resultItem.index;
      }

      // Remove item without updates
      if (Object.keys(resultItem).length === 0) {
        delete result.items[id];
      }
    });
  }

  return result;
};

const clearEmptyItem = (
  result: TemplateModel,
  settings: ComposableItemSettings
) => {
  const { targetId } = settings;

  if (
    result.items[targetId] &&
    Object.keys(result.items[targetId] || {}).length === 0
  ) {
    delete result.items[targetId];
  }
  return result;
};

const createItemValues = (type: string) => {
  const itemValuesKeys = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five'];
  const itemType = typeof type === 'string' ? `${type}`.toLowerCase() : type;
  const valueKeys = itemValuesKeys;
  const scores = INSPECTION_SCORES[itemType];
  const itemValues = Object.create(null);

  if (!scores) {
    return null;
  }

  /*
   * Set `mainInput<key-value>Value` = score for each score
   */
  scores.forEach((score, index) => {
    itemValues[`mainInput${valueKeys[index]}Value`] = scores[index];
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
    .filter(
      (id) => (previousItems[id] || currentItems[id]).sectionId === sectionId
    )
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
