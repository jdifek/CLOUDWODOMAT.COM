import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/api-happy': {
        target: 'https://api.happy-ti.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-happy/, ''),
      }
    }
  }
});