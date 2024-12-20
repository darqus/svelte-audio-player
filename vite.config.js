import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vite.dev/config/
export default defineConfig({
  base: './', // Set base to relative path
  plugins: [svelte()],
  build: {
    outDir: 'dist', // Set output directory
    assetsDir: 'assets', // Set assets directory
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
    lib: {
      entry: 'src/components/AudioPlayer.svelte',
      name: 'AudioPlayer',
      fileName: (format) => `index.${format}.js`,
      formats: ['es'],
    },
  },
})
