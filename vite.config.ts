import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'ScoreKeep',
        short_name: 'ScoreKeep',
        description: 'Create a scoresheet and save it to your device',
        theme_color: '#4395a7',
        background_color: '#1a1a1a',
        display: 'standalone',
        orientation: 'any',
       icons: [
           {
             src: 'scorekeep-icon192x192.png',
             sizes: '192x192',
             type: 'image/png',
           },
           {
             src: 'scorekeep-icon256x256.png',
             sizes: '256x256',
             type: 'image/png',
           },
           {
             src: 'scorekeep-icon384x384.png',
             sizes: '384x384',
             type: 'image/png',
           },
           {
             src: 'scorekeep-icon-512x512.png',
             sizes: '512x512',
             type: 'image/png',
             purpose: 'any',
           },
           {
             src: 'scorekeep-icon-512x512.png',
             sizes: '512x512',
             type: 'image/png',
             purpose: 'maskable',
           },
           {
             src: 'scorekeep-icon-1024x1024.png',
             sizes: '1024x1024',
             type: 'image/png',
           },
        ],
        start_url: '/',
      },
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
});
