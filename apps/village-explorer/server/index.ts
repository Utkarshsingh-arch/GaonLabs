import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { aiRouter } from './routes/ai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8787;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'http://localhost:5173';

app.use(cors({ origin: ALLOWED_ORIGIN, credentials: true }));
app.use(express.json());

// Health probe
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'gaonlab-village-explorer-ai-proxy',
    provider: process.env.AI_PROVIDER || 'mock',
  });
});

// AI endpoints
app.use('/api/ai', aiRouter);

app.listen(PORT, () => {
  console.log(`[AI Proxy] Server listening on http://localhost:${PORT}`);
});
