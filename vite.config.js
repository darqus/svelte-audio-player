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
    sourcemap: true, // Enable source maps
    lib: {
      entry: 'src/main.js', // Entry point for the library
      name: 'AudioPlayer', // Global variable name for the library
      formats: ['es'],
      fileName: 'svelte-audio-player',
    },
  },
})
