import pipe from '../pipe';
import TemplateModel from '../../models/template';
import ComposableSettings, { UserChanges } from './composableSettings';
import updateGeneral from './updateGeneral';

const PREFIX = 'utils: template: update';

// Manage local updates for template's updates
export default function update(
  updatedItem: TemplateModel,
  currentItem: TemplateModel,
  userChanges: UserChanges
): TemplateModel {
  const changeCount = userChanges ? Object.keys(userChanges).length : 0;

  if (changeCount < 1) {
    throw Error(`${PREFIX} requires at least one change`);
  }

  if (changeCount > 1) {
    throw Error(`${PREFIX} handles only 1 change`);
  }

  return updateGeneral(updatedItem, currentItem, userChanges);
}
