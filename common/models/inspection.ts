import inspectionTemplate from './inspectionTemplate';

interface inspection {
  id: string;
  creationDate: number;
  completionDate?: number;
  deficienciesExist: boolean;
  inspectionCompleted: boolean;
  inspectorName: string;
  inspectionReportFilename?: string;
  inspectionReportURL?: string;
  itemsCompleted: number;
  score: number;

  // Report attributes
  inspectionReportStatus?: string;
  inspectionReportUpdateLastDate?: number;
  inspectionReportStatusChanged?: number;

  // Relationships
  template?: inspectionTemplate;
  templateCategory?: string;
  property: string;
  inspector: string;

  templateId?: string;
  templateName?: string;
  totalItems?: number;
  updatedAt?: number;
  updatedLastDate?: number;
}

export default inspection;
