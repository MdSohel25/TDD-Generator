import express from 'express';
import multer from 'multer';
import helmet from 'helmet';
import cors from 'cors';
import { env } from './config/env.js';
import { TddGenerationService } from './services/tdd-generation.service.js';
import path from 'node:path';

const app = express();
app.use(helmet());
app.use(cors({ origin: env.webOrigin }));
app.use(express.json({ limit: '10mb' }));

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });
const generationService = new TddGenerationService();
const jobs = new Map<string, { status: 'queued'|'processing'|'completed'|'failed'; progress: number; filePath?: string }>();

app.post('/api/v1/uploads/csn', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'file is required' });
  const uploadId = Date.now().toString();
  return res.json({ uploadId, filename: req.file.originalname, size: req.file.size });
});

app.post('/api/v1/tdd/generate', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'file is required in multipart as file' });
  const preJobId = Date.now().toString();
  jobs.set(preJobId, { status: 'processing', progress: 20 });
  try {
    const { jobId, filePath } = await generationService.generate(req.file.buffer);
    jobs.delete(preJobId);
    jobs.set(jobId, { status: 'completed', progress: 100, filePath });
    return res.json({ jobId, status: 'processing' });
  } catch (error) {
    jobs.set(preJobId, { status: 'failed', progress: 100 });
    return res.status(500).json({ message: error instanceof Error ? error.message : 'generation failed' });
  }
});

app.get('/api/v1/jobs/:jobId', (req, res) => {
  const job = jobs.get(req.params.jobId);
  if (!job) return res.status(404).json({ message: 'job not found' });
  return res.json({ ...job, jobId: req.params.jobId, downloadUrl: job.filePath ? `/api/v1/tdd/download/${req.params.jobId}` : undefined });
});

app.get('/api/v1/tdd/download/:jobId', (req, res) => {
  const job = jobs.get(req.params.jobId);
  if (!job?.filePath) return res.status(404).json({ message: 'generated file not found' });
  return res.download(path.resolve(job.filePath), `tdd-${req.params.jobId}.xlsx`);
});

app.listen(env.port, () => console.log(`API server listening on http://localhost:${env.port}`));
