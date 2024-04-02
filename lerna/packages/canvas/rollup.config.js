import typescript from '@rollup/plugin-typescript'
import { getBabelOutputPlugin } from '@rollup/plugin-babel'
// import resolve from '@rollup/plugin-node-resolve'

export default {
  input: 'lib/index.ts',
  output: [
    {
      file: 'dist/cjs/index.js',
      format: 'cjs',
    },
    {
      file: 'dist/esm/index.js',
      format: 'esm',
    },
    {
      file: 'dist/index.js',
      format: 'umd',
      name: 'CanvasModule'
    }
  ],
  plugins: [
    typescript({
      module: 'ES2015'
    }),
    getBabelOutputPlugin({
      presets: ['@babel/preset-env'],
      allowAllFormats: true
    })
  ]
}