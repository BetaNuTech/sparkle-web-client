/* eslint-disable camelcase */
interface DeficientItemLocalPhotos {
  id: string;
  createdAt: number;
  caption: string;
  property: string;
  inspection: string;
  deficiency: string;
  item: string;
  startDate: number;
  photoData: string;
  size: number;
  downloadURL?: string; // temporary placeholder for the uploaded photo location
  fileId?: string; // temporary placeholder for uploaded photo id
}

export default DeficientItemLocalPhotos;
