import updateItem, { userUpdate as userItemUpdate } from './updateTemplateItem';
import updateSection, {
  userUpdate as userSectionUpdate
} from './updateTemplateSection';
import inspectionTemplateUpdateModel from '../../models/inspections/templateUpdate';
import inspectionTemplateItemModel from '../../models/inspectionTemplateItem';

export interface userUpdate {
  items?: Record<string, userItemUpdate>;
  sections?: Record<string, userSectionUpdate>;
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
  updatedTemplate: inspectionTemplateUpdateModel,
  currentTemplate: inspectionTemplateUpdateModel,
  userChanges: userUpdate,
  userChangeOptions?: updateOptions
): inspectionTemplateUpdateModel {
  let result = JSON.parse(
    JSON.stringify(updatedTemplate)
  ) as inspectionTemplateUpdateModel;
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

  if (!targetId) {
    throw Error(
      `${PREFIX} an ${
        isItemUpdate ? 'item' : 'section'
      } update must reference an ${
        isItemUpdate ? 'item' : 'section'
      } by an identifier`
    );
  }

  if (isItemUpdate) {
    const updatedItem =
      getItem(updatedTemplate, targetId) || ({} as inspectionTemplateItemModel);
    const currentItem =
      getItem(currentTemplate, targetId) ||
      getItem(updatedTemplate, targetId) || // for unpublished multi-section item
      null;
    const changes = (userChanges.items || {})[targetId] || null;

    // Setup any missing items hash
    result.items = result.items || {};

    // Apply user's item changes
    result.items[targetId] = updateItem(
      updatedItem,
      currentItem,
      changes,
      options
    );

    // Remove no longer applicable updates
    if (!result.items[targetId]) delete result.items[targetId];
  } else {
    // Setup section update
    const changes = (userChanges.sections || {})[targetId] || null;

    // Apply user's section changes
    // Sectional changes can affect
    // both items and sections
    result = updateSection(updatedTemplate, currentTemplate, changes, targetId);
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
  template: inspectionTemplateUpdateModel,
  itemId: string
): inspectionTemplateItemModel | null {
  const items = (template || {}).items || {};
  return items[itemId] || null;
}
