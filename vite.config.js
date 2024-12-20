import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vite.dev/config/
export default defineConfig({
  base: './', // Set base to relative path
  plugins: [svelte()],
  build: {
    outDir: 'dist', // Set output directory
    assetsDir: 'assets', // Set assets directory
  },
})
