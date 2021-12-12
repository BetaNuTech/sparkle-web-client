import userUpdate from './userUpdate';
import updateOptions from './updateOptions';
import inspectionTemplateItemModel from '../../../models/inspectionTemplateItem';

export default interface composableSettings {
  updatedItem: inspectionTemplateItemModel;
  currentItem: inspectionTemplateItemModel;
  userChanges: userUpdate;
  options: updateOptions;
  // eslint-disable-next-line semi
}
