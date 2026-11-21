import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'serve-character-assets',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          try {
            const decodedUrl = decodeURIComponent(req.url.split('?')[0]);
            if (decodedUrl.startsWith('/assets-api/')) {
              const relPath = decodedUrl.replace('/assets-api/', '');
              const filePath = path.resolve(__dirname, 'Assets', relPath);
              if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
                const stat = fs.statSync(filePath);
                res.writeHead(200, {
                  'Content-Type': 'application/octet-stream',
                  'Content-Length': stat.size,
                  'Access-Control-Allow-Origin': '*'
                });
                fs.createReadStream(filePath).pipe(res);
                return;
              }
            }
          } catch (e) {
            console.error('Asset stream error:', e);
          }
          next();
        });
      }
    }
  ],
  assetsInclude: ['**/*.fbx', '**/*.FBX'],
  server: {
    host: '127.0.0.1',
    port: 5173,
    open: false
  }
});
