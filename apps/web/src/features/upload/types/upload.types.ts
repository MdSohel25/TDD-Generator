export interface UploadResponse {
  uploadId: string;
  filename: string;
}

export interface GenerateResponse {
  jobId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
}

export interface JobResponse {
  jobId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  downloadUrl?: string;
  message?: string;
}
