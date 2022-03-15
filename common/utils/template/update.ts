import TemplateModel from '../../models/template';
import { UserChanges } from './composableSettings';
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
  const [targetId] = isSectionUpdate
    ? Object.keys(userChanges.sections)
    : Object.keys(userChanges.items || {});

  if (isSectionUpdate) {
    changeCount = Object.keys(userChanges.sections).length;
  }

  if (changeCount < 1) {
    throw Error(`${PREFIX} requires at least one change`);
  }

  if (changeCount > 1) {
    throw Error(`${PREFIX} handles only 1 change`);
  }

  if (isSectionUpdate && !targetId) {
    throw Error(
      `${PREFIX} a section update must reference a section by an identifier`
    );
  }

  if (isSectionUpdate) {
    // Setup section update
    const changes = (userChanges.sections || {})[targetId] || null;

    // Apply user's section changes
    result = updateSection(updatedTemplate, currentTemplate, changes, targetId);
  } else {
    result = updateGeneral(updatedTemplate, currentTemplate, userChanges);
  }

  // Remove empty sections hash from updates
  if (!Object.keys(result.sections || {}).length) {
    delete result.sections;
  }

  return result;
}
