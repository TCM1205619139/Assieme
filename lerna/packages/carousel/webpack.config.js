const path = require('node:path')
const merge = require('lodash/merge')
const webpackBaseConfig = require('../../build/webpack.base')

module.exports = merge(webpackBaseConfig, {
  entry: path.resolve(__dirname, 'lib/tc-toolkit.js'),
  output: {
    filename: 'tc-toolkit.js',
    path: path.resolve(__dirname, 'dist'),
    library: {
      type: 'module',
    }
  }
})
