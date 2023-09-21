import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
    server: {
    port : 5000
  },
  build: {
    chunkSizeWarningLimit: 5000 // increase the chunk size limit to 1000kb
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
