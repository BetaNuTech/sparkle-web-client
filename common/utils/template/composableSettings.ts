import TemplateModel from '../../models/template';

export interface UserItemChanges {
  sectionId?: string;
  itemType?: string;
  title?: string;
  index?: number;
  photos?: boolean;
  notes?: boolean;
  mainInputType?: string;
  mainInputZeroValue?: number;
  mainInputOneValue?: number;
  mainInputTwoValue?: number;
  mainInputThreeValue?: number;
  mainInputFourValue?: number;
}

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

export interface ComposableItemSettings {
  updatedTemplate: TemplateModel;
  currentTemplate: TemplateModel;
  userChanges: UserItemChanges;
  targetId?: string;
}

export default interface ComposableSettings {
  updatedTemplate: TemplateModel;
  currentTemplate: TemplateModel;
  userChanges: UserChanges;
  // eslint-disable-next-line semi
}
