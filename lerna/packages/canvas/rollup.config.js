import { merge } from 'lodash-es'
import RollupBaseConfig from '../../build/rollup.base.js'


export default merge(RollupBaseConfig, {
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
  ]
})