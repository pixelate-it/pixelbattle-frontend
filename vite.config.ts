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
            },
            output: {
                manualChunks(l) {
                    if(l.includes("node_modules")) {
                        const a = l.toString().split("node_modules/")[1].split("/")[0]
                        return a.toString();
                    }
                }
            },
        },
    }
});
