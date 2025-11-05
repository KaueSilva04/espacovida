export interface UploadSignatureResponse {
  apiKey: string;
  cloudName: string;
  uploadPreset: string;
  signature: string;
  timestamp: number;
  folder: string;
}

export default UploadSignatureResponse;