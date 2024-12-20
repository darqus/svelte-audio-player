import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import sveltePreprocess from 'svelte-preprocess'

export default defineConfig({
  plugins: [
    svelte({
      preprocess: sveltePreprocess(),
    }),
  ],
  build: {
    outDir: 'dist', // Set output directory
    lib: {
      entry: 'src/main.js', // Entry point for the library
      name: 'AudioPlayer', // Global variable name for the library
      formats: ['iife'], // Include both IIFE and ES formats
      fileName: 'svelte-audio-player',
    },
  },
})
