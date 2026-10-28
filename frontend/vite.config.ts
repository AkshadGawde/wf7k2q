import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  // Recharts dominates the bundle (~180 kB gzipped); acceptable for a single-page dashboard.
  build: { chunkSizeWarningLimit: 700 },
})
