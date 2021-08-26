interface bidAttachment {
  id: string;
  createdAt: number; // Unix timestamp
  name: string;
  type: string;
  url: string;
  storageRef: string; // Firebase storage file url reference for downloading or deleting purpopse
  size: number; // size in bytes
}

export default bidAttachment;
