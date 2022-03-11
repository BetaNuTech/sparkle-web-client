import TemplateModel from '../../models/template';

export interface UserChanges {
  name?: string;
  description?: string;
  category?: string;
  trackDeficientItems?: boolean;
  requireDeficientItemNoteAndPhoto?: boolean;
}

export default interface ComposableSettings {
  updatedItem: TemplateModel;
  currentItem: TemplateModel;
  userChanges: UserChanges;
  // eslint-disable-next-line semi
}
