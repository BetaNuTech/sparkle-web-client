import TemplateModel from '../../models/template';

export interface UserSectionChanges {
  new?: boolean;
  title?: string;
  index?: number;
  // eslint-disable-next-line camelcase
  section_type?: 'single' | 'multi';
}
export interface UserChanges {
  name?: string;
  description?: string;
  category?: string;
  trackDeficientItems?: boolean;
  requireDeficientItemNoteAndPhoto?: boolean;
  sections?: UserSectionChanges;
  items?: any;
}

export interface ComposableSectionSettings {
  updatedTemplate: TemplateModel;
  currentTemplate: TemplateModel;
  userChanges: UserSectionChanges;
  targetId?: string;
}

export default interface ComposableSettings {
  updatedTemplate: TemplateModel;
  currentTemplate: TemplateModel;
  userChanges: UserChanges;
  // eslint-disable-next-line semi
}
