const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')
const resolve = dir => path.resolve(__dirname, dir)

module.exports = {
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          }
        ],
      },
      {
        test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192
            }
          }
        ]
      },
    ],
  },
  resolve: {
    alias: {
      '@': resolve('src'),
      '@s': resolve('style'),
      '@p': resolve('packages')
    }
  },
  plugins: [
    new VueLoaderPlugin()
  ]
}