import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Base path differs per host: GitHub Pages serves under /kanzasset-web/, while
// Vercel serves from the domain root. Vercel sets VERCEL=1 during its builds,
// so both deploys keep working from the same repo.
export default defineConfig({
  plugins: [react()],
  base: process.env.VERCEL ? '/' : '/kanzasset-web/',
});
