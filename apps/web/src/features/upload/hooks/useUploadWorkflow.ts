import { useCallback, useEffect, useMemo, useState } from 'react';
import { generateTdd, getJob, uploadCsn } from '../services/upload.service';
import { JobResponse } from '../types/upload.types';

export function useUploadWorkflow() {
  const [job, setJob] = useState<JobResponse | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(async (file: File) => {
    setError(null); setIsUploading(true); setJob(null);
    try {
      await uploadCsn(file);
      const generate = await generateTdd(file);
      setJob({ jobId: generate.jobId, status: 'processing', progress: 30 });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally { setIsUploading(false); }
  }, []);

  useEffect(() => {
    if (!job?.jobId || job.status === 'completed' || job.status === 'failed') return;
    const timer = setInterval(async () => {
      try { setJob(await getJob(job.jobId)); } catch { }
    }, 1500);
    return () => clearInterval(timer);
  }, [job?.jobId, job?.status]);

  const canDownload = useMemo(() => Boolean(job?.downloadUrl && job.status === 'completed'), [job]);
  return { submit, job, isUploading, error, canDownload };
}
