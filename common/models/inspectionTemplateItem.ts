import adminEditModel from './inspectionTemplateItemAdminEdit';
import photoDataModel from './inspectionTemplateItemPhotoData';

/* eslint-disable camelcase */
interface inspectionTemplateItem {
  id?: string;
  deficient: boolean;
  index: number;
  isItemNA?: boolean;
  isTextInputItem?: boolean;
  itemType: string;
  title: string;
  mainInputType?: string;
  mainInputZeroValue?: number;
  mainInputOneValue?: number;
  mainInputTwoValue?: number;
  mainInputThreeValue?: number;
  mainInputFourValue?: number;
  textInputValue?: string;
  mainInputNotes?: string;
  notes?: boolean;
  photos?: boolean;
  inspectorNotes?: string;
  sectionId: string;
  signatureDownloadURL?: string;
  signatureTimestampKey?: string;
  mainInputSelected?: boolean;
  mainInputSelection?: number;
  adminEdits?: Record<string, adminEditModel>;
  photosData?: Record<string, photoDataModel>;
  version?: number;
}

export default inspectionTemplateItem;
