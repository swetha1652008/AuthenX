import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDatabase } from './db.js';
import { createApiRouter } from './apiRouter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Database
initDatabase();

app.use(express.json({ limit: '15mb' }));

// Mount API Router
app.use('/api', createApiRouter());

// Serve static frontend build if present
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

// Fallback to index.html for client-side routing
app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[AuthenX Backend] Server running on http://localhost:${PORT}`);
    console.log(`[AuthenX Backend] Database initialized at data_storage/authenx_documents.sqlite`);
    console.log(`[AuthenX Backend] Gemini AI Model integration: ${process.env.GEMINI_API_KEY ? 'LIVE' : 'HEURISTIC_FALLBACK'}`);
  });
}

export default app;
