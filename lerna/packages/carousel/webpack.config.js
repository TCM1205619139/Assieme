const path = require('node:path')
const { merge } = require('webpack-merge')
const webpackCommonConfig = require('../../build/webpack.config')

module.exports = merge(webpackCommonConfig, {
  entry: path.resolve(__dirname, 'lib/index.js')
})
