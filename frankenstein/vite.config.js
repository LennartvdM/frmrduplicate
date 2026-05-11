import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

function ogUploadPlugin() {
  return {
    name: 'og-upload',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/__upload-og', async (req, res, next) => {
        if (req.method !== 'POST') return next()
        try {
          const chunks = []
          for await (const chunk of req) chunks.push(chunk)
          const buf = Buffer.concat(chunks)
          if (buf.length === 0) {
            res.statusCode = 400
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ ok: false, error: 'empty body' }))
            return
          }
          const dest = path.resolve(server.config.root, 'public/og-preview.png')
          await mkdir(path.dirname(dest), { recursive: true })
          await writeFile(dest, buf)
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ ok: true, bytes: buf.length, path: '/og-preview.png' }))
        } catch (err) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ ok: false, error: String(err && err.message || err) }))
        }
      })
    },
  }
}

export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [react(), ogUploadPlugin()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    minify: 'terser',
    sourcemap: false,
    rollupOptions: {
      input: { main: './index.html' },
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
})
