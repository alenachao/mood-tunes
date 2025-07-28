import react from '@vitejs/plugin-react-swc';
import { defineConfig, loadEnv } from 'vite';
import * as path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      port: 5173,
      open: false,
      hmr: {    
        port: 5173,
        host: 'localhost'
      },
      proxy: {
        '/api': {
          target: env.VITE_SERVER_URL,
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
  };
});