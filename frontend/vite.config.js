import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return

          if (
            id.includes('@stream-io/video-react-sdk') ||
            id.includes('stream-chat-react') ||
            id.includes('stream-chat')
          ) {
            return 'stream'
          }
          if (id.includes('@monaco-editor') || id.includes('/monaco/')) return 'monaco'
          if (id.includes('@clerk')) return 'clerk'
          if (id.includes('react-router')) return 'router'
          if (id.includes('@tanstack/react-query')) return 'react-query'
          if (id.includes('react-dom') || id.includes('/react/')) return 'react-core'
          if (id.includes('lucide-react')) return 'icons'
          if (id.includes('date-fns')) return 'date-utils'
          if (id.includes('canvas-confetti')) return 'effects'
        },
      },
    },
  },
})