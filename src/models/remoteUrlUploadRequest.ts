
export interface RemoteUrlUploadRequest {
  fileUrl: string;
  files: string[];
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
}