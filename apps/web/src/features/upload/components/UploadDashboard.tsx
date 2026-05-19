import { FormEvent, useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { useUploadWorkflow } from '../hooks/useUploadWorkflow';
import { Card } from '../../../shared/components/ui/card';
import { Button } from '../../../shared/components/ui/button';
import { Progress } from '../../../shared/components/ui/progress';

export function UploadDashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const { submit, job, isUploading, error, canDownload } = useUploadWorkflow();

  const onSubmit = async (event: FormEvent) => { event.preventDefault(); if (file) await submit(file); };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <h2 className="text-xl font-semibold">Upload Datasphere Metadata</h2>
        <form onSubmit={onSubmit} className="mt-4 space-y-4">
          <label
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); setFile(e.dataTransfer.files?.[0] ?? null); }}
            className={`flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed p-10 text-center ${dragging ? 'border-brand-600 bg-blue-50' : 'border-slate-300 bg-slate-50'}`}
          >
            <UploadCloud className="mb-2 h-8 w-8 text-brand-600" />
            <input type="file" accept=".json,.csn,application/json" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            <p className="font-medium">{file ? file.name : 'Drag & drop CSN/JSON or click to browse'}</p>
            <p className="text-sm text-slate-500">Max 10MB</p>
          </label>
          <Button type="submit" disabled={!file || isUploading}>{isUploading ? 'Processing...' : 'Generate TDD Excel'}</Button>
        </form>
        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
      </Card>

      <Card>
        <h2 className="text-xl font-semibold">Generation Status</h2>
        {!job ? <p className="mt-4 text-slate-500">No active generation.</p> : (
          <div className="mt-4 space-y-3">
            <p><span className="font-medium">Job ID:</span> {job.jobId}</p>
            <p><span className="font-medium">Status:</span> {job.status}</p>
            <Progress value={job.progress ?? 0} />
            {canDownload ? <a className="text-brand-700 underline" href={job.downloadUrl}>Download Generated File</a> : <p className="text-sm text-slate-500">Preparing downloadable output…</p>}
          </div>
        )}
      </Card>
    </div>
  );
}
