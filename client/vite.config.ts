import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import * as path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true, 
      },
    },
  },
  build: {},
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
