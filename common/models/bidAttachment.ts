interface bidAttachment {
  createdAt: number; // Unix timestamp
  name: string;
  type: string;
  url: string;
  size: number; // size in bytes
}

export default bidAttachment;
