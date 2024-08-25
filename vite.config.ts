import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact()],
  resolve: {
    alias: {
      src: resolve('src/')
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        404: resolve(__dirname, '404.html')
      },
      output: {
        manualChunks(id) {
          if (/node_modules\/.*preact.*/.test(id)) {
            return 'preact'
          }
        }
      }
    },
    minify: 'terser',
    cssCodeSplit: true,
    modulePreload: true
  }
})
