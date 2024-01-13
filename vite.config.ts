import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [preact()],
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, "index.html"),
                404: resolve(__dirname, "404.html"),
            }
        }
    }
});
