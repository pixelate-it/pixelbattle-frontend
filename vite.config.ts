import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import preact from '@preact/preset-vite';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        preact(),
        VitePWA({
            registerType: 'autoUpdate',
            manifest: {
                name: 'Pixel Battle by Pixelate It!',
                description: 'Место, где вы можете побороться за место на холсте вместе с другими игроками',
                short_name: 'Pixel Battle',
                start_url: '/',
                categories: ['games', 'entertainment'],
                display: 'standalone',
                orientation: 'portrait',
                background_color: '#282828',
                theme_color: '#154CB7',
                icons: [
                    {
                        src: '/pwa/favicon_700x700.png',
                        type: 'image/png',
                        sizes: '700x700'
                    },
                    {
                        src: '/pwa/favicon_192x192.png',
                        type: 'image/png',
                        sizes: '192x192',
                        purpose: 'maskable'
                    },
                    {
                        src: '/pwa/favicon_180x180.png',
                        type: 'image/png',
                        sizes: '180x180',
                        purpose: 'maskable'
                    },
                    {
                        src: '/pwa/favicon_152x152.png',
                        type: 'image/png',
                        sizes: '152x152',
                        purpose: 'maskable'
                    },
                    {
                        src: '/pwa/favicon_144x144.png',
                        type: 'image/png',
                        sizes: '144x144',
                        purpose: 'maskable'
                    },
                    {
                        src: '/pwa/favicon_120x120.png',
                        type: 'image/png',
                        sizes: '120x120',
                        purpose: 'maskable'
                    },
                    {
                        src: '/pwa/favicon_114x114.png',
                        type: 'image/png',
                        sizes: '114x114',
                        purpose: 'maskable'
                    },
                    {
                        src: '/pwa/favicon_76x76.png',
                        type: 'image/png',
                        sizes: '76x76',
                        purpose: 'maskable'
                    },
                    {
                        src: '/pwa/favicon_72x72.png',
                        type: 'image/png',
                        sizes: '72x72',
                        purpose: 'maskable'
                    },
                    {
                        src: '/pwa/favicon_57x57.png',
                        type: 'image/png',
                        sizes: '57x57',
                        purpose: 'maskable'
                    }
                ],
                screenshots: [
                    {
                        src: '/pwa/screenshots/desktop.png',
                        type: 'image/png',
                        sizes: '1920x921',
                        form_factor: 'wide'
                    },
                    {
                        src: '/pwa/screenshots/mobile.png',
                        type: 'image/png',
                        sizes: '360x800',
                        form_factor: 'narrow'
                    }
                ]
            }
        })
    ],
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, "index.html"),
                404: resolve(__dirname, "404.html"),
            },
            output: {
                manualChunks(id) {
                    if(/node_modules\/.*preact.*/.test(id)) {
                        return 'preact';
                    }

                    if(/node_modules\/.*pixi.*/.test(id)) {
                        return 'render';
                    }
                }
            }
        },
        minify: "terser",
        cssCodeSplit: true,
        modulePreload: true
    }
});
