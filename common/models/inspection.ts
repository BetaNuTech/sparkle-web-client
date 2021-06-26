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
  inspectionReportUpdateLastDate?: string;

  // Relationships
  template?: any;
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
