const path = require('node:path')
const merge = require('lodash/merge')
const webpackBaseConfig = require('../../build/webpack.base')

module.exports = merge(webpackBaseConfig, {
  entry: path.resolve(__dirname, 'lib/index.js'),
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    library: {
      type: 'module',
    }
  }
})
