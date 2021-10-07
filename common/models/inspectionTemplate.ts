import inspectionTemplateSectionModel from './inspectionTemplateSection';

interface inspectionTemplate {
  name: string;
  category?: string;
  description?: string;
  requireDeficientItemNoteAndPhoto: boolean;
  trackDeficientItems: boolean;

  // Sections
  sections?: Record<string, inspectionTemplateSectionModel>;
}

export default inspectionTemplate;
