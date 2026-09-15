import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig, Plugin} from 'vite';

const logoUploaderPlugin = (): Plugin => ({
  name: 'logo-uploader',
  configureServer(server) {
    server.middlewares.use('/api/branding/upload-logo', (req, res) => {
      if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
          body += chunk;
        });
        req.on('end', () => {
          try {
            const data = JSON.parse(body);
            if (!data.base64Data) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Missing base64Data' }));
              return;
            }
            const matches = data.base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
            const base64Str = matches ? matches[2] : data.base64Data;
            const buffer = Buffer.from(base64Str, 'base64');
            const targetDir = path.resolve(__dirname, 'public/logos');
            if (!fs.existsSync(targetDir)) {
              fs.mkdirSync(targetDir, { recursive: true });
            }
            const targetPath = path.resolve(targetDir, 'golpox-logo.png');
            fs.writeFileSync(targetPath, buffer);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              success: true,
              path: '/logos/golpox-logo.png',
              storagePath: 'public/logos/golpox-logo.png',
              timestamp: Date.now(),
            }));
          } catch (err: any) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
          }
        });
      } else {
        res.writeHead(405);
        res.end();
      }
    });
  },
});

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), logoUploaderPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
