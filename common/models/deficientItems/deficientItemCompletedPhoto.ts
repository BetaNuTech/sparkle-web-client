interface DeficientItemCompletedPhoto {
  id?: string;
  createdAt: number; // UNIX timestamp
  startDate: number; // UNIX timestamp
  caption?: string;
  user: string;
  downloadURL: string;
  storageDBPath: string;
}

export default DeficientItemCompletedPhoto;
