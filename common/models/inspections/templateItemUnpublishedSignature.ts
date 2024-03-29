/* eslint-disable camelcase */
interface inspectionTemplateUnpublishedSignature {
  id: string;
  createdAt: number;
  inspection: string;
  item: string;
  signature: string; // base64 data URL stored locally
  property: string;
  size: number; // file size in bytes
  signatureDownloadURL?: string; // temporary placeholder for the uploaded PNG location
}

export default inspectionTemplateUnpublishedSignature;
