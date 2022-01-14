/* eslint-disable camelcase */
interface inspectionTemplateItemLocalPhotoData {
  id: string;
  createdAt: number;
  caption: string;
  inspection: string;
  item: string;
  photoData: string;
  property: string;
  size: number; // file size in bytes
  downloadURL?: string; // temporary placeholder for the uploaded photo location
  fileId?: string; // temporary placeholder for uploaded photo id
}

export default inspectionTemplateItemLocalPhotoData;
