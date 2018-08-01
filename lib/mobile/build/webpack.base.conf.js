const path = require('path')
const config = require('./conf')
const APP_CONFIG = require('../appConfig')
const utils = require('./utils')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HappyPack = require('happypack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

const webpackConfig = {
  mode: process.env.NODE_ENV,

  entry: {
    app: resolve('src/main.js'),
  },

  module: {
    rules: [{
      test: /\.js[x]?$/,
      loader: 'happypack/loader?id=jsx',
      include: [resolve('src')],
    }, {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: utils.assetsPath('fonts/[name].[hash:7].[ext]'),
        publicPath: config[process.env.PACKAGE].cssAssetsPath,
      },
    }, {
      test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: utils.assetsPath('img/[name].[hash:7].[ext]'),
        publicPath: config[process.env.PACKAGE].cssAssetsPath,
      },
    }, {
      test: /\.css$/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
      ],
    }, {
      test: /\.scss$/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        'px2rem-loader?remUnit=100',
        'postcss-loader',
        'sass-loader',
      ],
    }],
  },

  plugins: [

    // 多线程打包
    new HappyPack({
      id: 'jsx',
      threads: 4,
      loaders: [
        'babel-loader',
        {
          loader: './build/auto-import-loader',
          options: {
            components: {
              Layout: 'src/auto/lib/layout',
              ActionSheet: 'src/auto/lib/action-sheet',
              Button: 'src/auto/lib/button',
              Cell: 'src/auto/lib/cell',
              Dialog: 'src/auto/lib/dialog',
              Input: 'src/auto/lib/input',
              Spin: 'src/auto/lib/spin',
              Popup: 'src/auto/lib/popup',
              Radio: 'src/auto/lib/radio',
              Select: 'src/auto/lib/select',
              Switch: 'src/auto/lib/switch',
              Tabs: 'src/auto/lib/tabs',
              TimePicker: 'src/auto/lib/time-picker',
              A: 'src/auto/lib/a',
            },
            include: [resolve('src/views'), resolve('src/components'), resolve('src/containers')],
          },
        }, {
          loader: './build/auto-prod-filter-loader',
        },
        {
          loader: 'eslint-loader',
          exclude: ['/node_modules/'],
        }
      ],
    }),

    // 提取html模板
    new HtmlWebpackPlugin({
      template: 'src/template.html',
      filename: 'index.html',
      inject: 'body', // 所有javascript资源将被注入至body底部
      minify: {
        removeComments: true, // 删除注释
        collapseWhitespace: true, // 压缩成一行
        removeAttributeQuotes: false // 删除引号
      },
      chunksSortMode: 'dependency' // 按照不同文件的依赖关系来排序
    }),

    // 提取公共样式
    new MiniCssExtractPlugin({
      // chunkFilename: "css/[name].[hash:7].css",
      filename: 'css/[name].[hash:7].css',
      allChunks: true,
    }),

    // pwa support
    new SWPrecacheWebpackPlugin({
      // Not required but you should include this, it will give your service worker cache a unique name. Defaults to "sw-precache-webpack-plugin".
      cacheId: APP_CONFIG.basename,
      dontCacheBustUrlsMatching: /\.\w{6}\./, // 我们指示插件把这些文件的文件名作为版本号
      filename: './sw.js',
      minify: true,
      mergeStaticsConfig: true,
      navigateFallback: APP_CONFIG.basename + '/index.html',
      staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/],
    })

  ],
  resolve: {
    extensions: ['.js', '.jsx', '.scss', '.css', '.mass'],
    alias: {
      'src': resolve('src'),
      '@': resolve('src'),
      'auto': resolve('src/auto'),
      '$assets': resolve('src/assets'),
      '$components': resolve('src/components'),
      '$containers': resolve('src/containers'),
      '$redux': resolve('src/redux'),
      '$views': resolve('src/views'),
    },
  },
}

module.exports = webpackConfig
