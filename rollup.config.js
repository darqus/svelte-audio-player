import svelte from 'rollup-plugin-svelte'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import resolve from '@rollup/plugin-node-resolve'
import css from 'rollup-plugin-css-only'

const production = !process.env.ROLLUP_WATCH

export default [
  {
    input: 'src/components/AudioPlayer.svelte', // Entry point for your component
    output: [
      { file: 'public/build/bundle.js', format: 'esm', sourcemap: true },
    ],
    plugins: [
      svelte({
        emitCss: true,
      }),
      css({ output: 'bundle.css' }),
      resolve({
        browser: true,
        dedupe: ['svelte'],
      }),
      commonjs(),
      production && terser(),
    ],
    watch: {
      clearScreen: false,
    },
  },
]
