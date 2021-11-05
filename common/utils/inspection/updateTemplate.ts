import updateItem, { userUpdate as userItemUpdate } from './updateTemplateItem';
import inspectionTemplateModel from '../../models/inspectionTemplate';
import inspectionTemplateItemModel from '../../models/inspectionTemplateItem';

// TODO relocate to section update util
interface sectionUpdate {
  cloneOf: string;
}

export interface userUpdate {
  items?: Record<string, userItemUpdate>;
  sections?: Record<string, sectionUpdate>;
}

interface updateOptions {
  adminEdit?: boolean;
}

const PREFIX = 'utils: inspection: updateTemplate:';
const DEFAULT_OPTIONS = Object.freeze({
  adminEdit: false
} as updateOptions);

// Manage local updates to an inspection's template
export default function inspectionUpdate(
  updatedTemplate: inspectionTemplateModel,
  currentTemplate: inspectionTemplateModel,
  userChanges: userUpdate,
  userChangeOptions?: updateOptions
): inspectionTemplateModel {
  const result = JSON.parse(
    JSON.stringify(updatedTemplate)
  ) as inspectionTemplateModel;
  const options = {
    ...DEFAULT_OPTIONS,
    ...(userChangeOptions || {})
  } as updateOptions;
  const isItemUpdate = Boolean(userChanges.items);
  const changeCount =
    Object.keys(userChanges.sections || {}).length +
    Object.keys(userChanges.items || {}).length;
  const [targetId] = userChanges.sections
    ? Object.keys(userChanges.sections)
    : Object.keys(userChanges.items || {});

  if (changeCount > 1) {
    throw Error(`${PREFIX} max 1 section or item change allowed per update`);
  } else if (changeCount === 0) {
    throw Error(`${PREFIX} requires at least one section or item change`);
  }

  if (isItemUpdate && !targetId) {
    throw Error(
      `${PREFIX} an item update must reference an item by an identifier`
    );
  }

  if (isItemUpdate) {
    const updatedItem =
      getItem(updatedTemplate, targetId) || ({} as inspectionTemplateItemModel);
    const currentItem = getItem(currentTemplate, targetId);
    const itemChanges = (userChanges.items || {})[targetId];

    // Setup any missing items hash
    result.items = result.items || {};

    // Apply user's item changes
    result.items[targetId] = updateItem(
      updatedItem,
      currentItem,
      itemChanges,
      options
    );

    // Remove no longer applicable updates
    if (!result.items[targetId]) delete result.items[targetId];
  } else {
    // Setup section update
    // TODO handle section updates
    // const sectionChanges =
    //   !isItemUpdate && targetId ? (userChanges.sections || {})[targetId] : null;
  }

  // Remove empty items hash from updates
  if (!Object.keys(result.items || {}).length) {
    delete result.items;
  }

  // Remove empty sections hash from updates
  if (!Object.keys(result.sections || {}).length) {
    delete result.sections;
  }

  return result;
}

// Lookup template item by its' index
function getItem(
  template: inspectionTemplateModel,
  itemId: string
): inspectionTemplateItemModel | null {
  const items = (template || {}).items || {};
  return items[itemId] || null;
}
