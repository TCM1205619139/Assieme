const typescript = require('@rollup/plugin-typescript')
const { getBabelOutputPlugin } = require('@rollup/plugin-babel')

module.exports = {
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