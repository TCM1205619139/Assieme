import { merge } from 'lodash-es'
import RollupBaseConfig from '../../build/rollup.base.js'


export default merge(RollupBaseConfig, {
  input: 'lib/index.ts',
  output: [
    {
      file: 'dist/cjs/tc-toolkit.js',
      format: 'cjs',
    },
    {
      file: 'dist/esm/tc-toolkit.js',
      format: 'esm',
    },
    {
      file: 'dist/tc-toolkit.js',
      format: 'umd',
      name: 'CanvasModule'
    }
  ]
})
