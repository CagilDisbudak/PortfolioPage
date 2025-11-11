import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Target the GitHub Pages project site path to avoid 404s when the trailing slash is missing
  base: '/PortfolioPage/',
});

