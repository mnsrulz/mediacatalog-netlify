import { Document } from 'mongoose';
export interface RemoteUrlUploadRequest extends Document {
  fileUrl: string;
  files: string[];
  parentUrl: string;
  accessToken: string;
  mediaType: string;  
  title: string;
  year: string;
  rawUpload: boolean;
  fileUrlHeaders: Record<string, string>;
}

export interface GetRemoteUrlUploadRequest {
  fileUrl: string;
  ts: Date;
  requestId: string;
  fileName: string;
  sequence: number;
  id: string
  status: string;
  message: string;
  parentUrl: string;
  fileUrlHeaders: Record<string, string>;
}