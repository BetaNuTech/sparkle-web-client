interface attachments {
  id?: string;
  name: string;
  type: string;
  url: string;
  storageRef: string; // Firebase storage file url reference for downloading or deleting purpopse
  size: number; // size in bytes
  createdAt: number; // Unix timestamp
}

export default attachments;
