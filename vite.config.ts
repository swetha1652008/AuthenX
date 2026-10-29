import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';
import express from 'express';
import { createApiRouter } from './server/apiRouter.js';
import { initDatabase } from './server/db.js';

function authenxApiPlugin(): Plugin {
  return {
    name: 'authenx-api-middleware',
    configureServer(server) {
      initDatabase();
      const apiApp = express();
      apiApp.use(express.json({ limit: '15mb' }));
      apiApp.use(createApiRouter());
      server.middlewares.use('/api', apiApp);
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), authenxApiPlugin()],
});
