import SectionModel from './inspectionTemplateSection';
import ItemModel from './inspectionTemplateItem';

interface template {
  id?: string;
  name: string;
  description: string;
  category: string; // template category relationship
  trackDeficientItems: boolean;
  requireDeficientItemNoteAndPhoto: boolean;
  properties?: Array<string>;
  sections?: Record<string, SectionModel>;
  items?: Record<string, ItemModel>;
  createdAt?: number;
  updatedAt?: number;
}

export default template;
