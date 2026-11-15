import { fileURLToPath, URL } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const path = (file: string) => fileURLToPath(new URL(file, import.meta.url));

// apps/preview serves the showcase and elements pages; `@/` imports reach the skin in src/.
export default defineConfig({
  root: path('./apps/preview'),
  // Relative URLs, so the build works at a domain root or in a subfolder such as GitHub Pages.
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      '@preview': path('./apps/preview/src'),
      '@': path('./src'),
    },
  },
  server: {
    fs: { allow: [path('.')] },
  },
  build: {
    outDir: path('./dist'),
    emptyOutDir: true,
    rolldownOptions: {
      // The public showcase page and the elements page.
      input: {
        site: path('./apps/preview/index.html'),
        elements: path('./apps/preview/elements.html'),
      },
    },
  },
});
