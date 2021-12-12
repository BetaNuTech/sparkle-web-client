import inspectionTemplateItemPhotoDataModel from '../../../models/inspectionTemplateItemPhotoData';

export default interface userUpdate {
  mainInputSelection?: number;
  isItemNA?: boolean;
  textInputValue?: string;
  mainInputNotes?: string;
  inspectorNotes?: string;
  signatureDownloadURL?: string;
  photosData?: Record<string, inspectionTemplateItemPhotoDataModel>;
  // eslint-disable-next-line semi
}
