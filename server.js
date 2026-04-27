import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import express from 'express';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProd = process.argv.includes('--prod');
const port = Number(process.env.PORT || 5173);

async function createApp() {
  const app = express();

  let vite;
  let prodTemplate;
  let prodRender;

  if (isProd) {
    const clientDist = path.resolve(__dirname, 'dist');
    const serverDist = path.resolve(__dirname, 'dist/server/entry-server.js');

    prodTemplate = await fs.readFile(path.resolve(clientDist, 'index.html'), 'utf-8');
    ({ render: prodRender } = await import(pathToFileURL(serverDist).href));

    app.use('/assets', express.static(path.resolve(clientDist, 'assets'), { maxAge: '1y', immutable: true }));
    app.use(express.static(clientDist, { index: false }));
  } else {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });

    app.use(vite.middlewares);
  }

  app.use(async (req, res) => {
    try {
      const url = req.originalUrl;
      const shouldSsrHome = url === '/' || url.startsWith('/?');

      let template;
      let render;

      if (isProd) {
        template = prodTemplate;
        render = prodRender;
      } else {
        template = await fs.readFile(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        ({ render } = await vite.ssrLoadModule('/src/entry-server.jsx'));
      }

      const appHtml = shouldSsrHome ? (await render(url)).html : '';
      const html = template.replace('<!--ssr-outlet-->', appHtml);

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (error) {
      if (!isProd && vite) {
        vite.ssrFixStacktrace(error);
      }
      console.error(error.stack);
      res.status(500).end(error.stack);
    }
  });

  app.listen(port, () => {
    console.log(`FocusoraHQ SSR server running on http://localhost:${port}`);
    console.log(`Mode: ${isProd ? 'production preview' : 'development'}`);
    console.log('Home route SSR: enabled for / only');
  });
}

createApp();
