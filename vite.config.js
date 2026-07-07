import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/fm-ddr-visualizer/',
  plugins: [react(), tailwindcss()],
  worker: {
    format: 'es',  // Use ES modules in workers (allows 'import' syntax)
  },
})