import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/ticketsTest/',
  // build: {
  //   rollupOptions: {
  //     output: {
  //       manualChunks: {
  //         react: ['react', 'react-dom'],
  //       },
  //     },
  //   },
  //   chunkSizeWarningLimit: 1000, // Adjust this limit as needed
  // },
});