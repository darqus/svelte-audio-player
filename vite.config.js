// filepath: /home/eo/projects/github/audio-player/vite.config.js
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import sveltePreprocess from 'svelte-preprocess'

export default defineConfig({
  base: './', // Set base to relative path
  plugins: [
    svelte({
      preprocess: sveltePreprocess(),
    }),
  ],
  build: {
    outDir: 'dist', // Set output directory
    assetsDir: 'assets', // Set assets directory
    rollupOptions: {},
    lib: {
      entry: 'src/components/AudioPlayer.svelte',
      name: 'AudioPlayer',
      fileName: (format) => `index.${format}.js`,
      formats: ['es'],
    },
  },
})
