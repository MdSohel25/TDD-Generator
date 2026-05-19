import { apiRequest } from '../../../shared/api/http';
import { GenerateResponse, JobResponse, UploadResponse } from '../types/upload.types';

export async function uploadCsn(file: File): Promise<UploadResponse> {
  const body = new FormData();
  body.append('file', file);
  return apiRequest<UploadResponse>('/uploads/csn', { method: 'POST', body });
}

export async function generateTdd(file: File): Promise<GenerateResponse> {
  const body = new FormData();
  body.append('file', file);
  return apiRequest<GenerateResponse>('/tdd/generate', { method: 'POST', body });
}

export async function getJob(jobId: string): Promise<JobResponse> {
  return apiRequest<JobResponse>(`/jobs/${jobId}`);
}
