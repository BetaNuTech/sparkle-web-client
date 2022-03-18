import TemplateModel from '../../models/template';
import { UserChanges } from './composableSettings';

import updateItem from './updateItem';
import updateGeneral from './updateGeneral';
import updateSection from './updateSection';

const PREFIX = 'utils: template: update';

// Manage local updates for template's updates
export default function update(
  updatedTemplate: TemplateModel,
  currentTemplate: TemplateModel,
  userChanges: UserChanges
): TemplateModel {
  let result = JSON.parse(JSON.stringify(updatedTemplate)) as TemplateModel;
  let changeCount = userChanges ? Object.keys(userChanges).length : 0;
  const isSectionUpdate = Boolean(userChanges.sections);
  const isItemUpdate = Boolean(userChanges.items);
  const [targetId] = isSectionUpdate
    ? Object.keys(userChanges.sections)
    : Object.keys(userChanges.items || {});

  if (isSectionUpdate) {
    changeCount = Object.keys(userChanges.sections).length;
  }
  if (isItemUpdate) {
    changeCount = Object.keys(userChanges.items).length;
  }

  if (changeCount < 1) {
    throw Error(`${PREFIX} requires at least one change`);
  }

  if (changeCount > 1) {
    throw Error(`${PREFIX} handles only 1 change`);
  }

  if ((isSectionUpdate || isItemUpdate) && !targetId) {
    throw Error(
      `${PREFIX} an ${
        isItemUpdate ? 'item' : 'section'
      } update must reference an ${
        isItemUpdate ? 'item' : 'section'
      } by an identifier`
    );
  }

  if (isSectionUpdate) {
    // Setup section update
    const changes =
      targetId === 'new'
        ? userChanges.sections
        : (userChanges.sections || {})[targetId] || null;

    // Apply user's section changes
    result = updateSection(updatedTemplate, currentTemplate, changes, targetId);
  } else if (isItemUpdate) {
    const changes = (userChanges.items || {})[targetId] || null;

    // Apply user's item changes
    result = updateItem(updatedTemplate, currentTemplate, changes, targetId);
  } else {
    result = updateGeneral(updatedTemplate, currentTemplate, userChanges);
  }

  // Remove empty sections hash from updates
  if (!Object.keys(result.sections || {}).length) {
    delete result.sections;
  }
  // Remove empty items hash from updates
  if (!Object.keys(result.items || {}).length) {
    delete result.items;
  }
  return result;
}
