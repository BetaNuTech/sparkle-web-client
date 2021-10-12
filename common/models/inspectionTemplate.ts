import inspectionTemplateSectionModel from './inspectionTemplateSection';
import inspectionTemplateItemModel from './inspectionTemplateItem';

interface inspectionTemplate {
  name: string;
  category?: string;
  description?: string;
  requireDeficientItemNoteAndPhoto: boolean;
  trackDeficientItems: boolean;
  items?: Record<string, inspectionTemplateItemModel>;
  // Sections
  sections?: Record<string, inspectionTemplateSectionModel>;
}

export default inspectionTemplate;