import inspectionTemplateSectionModel from './inspectionTemplateSection';
import inspectionTemplateItemModel from './inspectionTemplateItem';

interface inspectionTemplate {
  name: string;
  category?: string;
  description?: string;
  requireDeficientItemNoteAndPhoto: boolean;
  trackDeficientItems: boolean;
  items?: Record<string, inspectionTemplateItemModel>;
  sections?: Record<string, inspectionTemplateSectionModel>;
  clone?:string;
}

export default inspectionTemplate;
