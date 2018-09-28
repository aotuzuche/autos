const path = require('path')
const config = require('./config')
const APP_CONFIG = config.APP_CONFIG
const utils = require('./utils')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HappyPack = require('happypack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')
const InlineScriptPlugin = require('./inline-script-plugin')
const isDev = process.env.NODE_ENV === 'development'

function resolve(dir) {
  return path.join(process.cwd(), dir)
}

const webpackConfig = {
  mode: process.env.NODE_ENV,

  entry: {
    app: resolve('src/main.js')
  },

  module: {
    rules: [
      {
        test: /\.js[x]?$/,
        loader: 'happypack/loader?id=jsx',
        include: [resolve('src')]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]'),
          publicPath: config[process.env.PACKAGE].cssAssetsPath
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: utils.assetsPath('img/[name].[hash:7].[ext]'),
              publicPath: config[process.env.PACKAGE].cssAssetsPath
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
      {
        test: /\.scss$/,
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'px2rem-loader?remUnit=100',
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                require('autoprefixer')({
                  browsers: ['iOS >= 7', 'Android >= 4.1']
                })
              ]
            }
          },
          'sass-loader'
        ]
      }
    ]
  },

  plugins: [
    // 多线程打包
    new HappyPack({
      id: 'jsx',
      threads: 4,
      loaders: [
        {
          loader: 'babel-loader',
          options: require('./babel.config'),
          exclude: ['/node_modules/']
        },
        {
          loader: path.join(__dirname, '/auto-prod-filter-loader')
        },
        {
          loader: 'eslint-loader',
          exclude: ['/node_modules/']
        }
      ]
    }),

    // 提取html模板
    new HtmlWebpackPlugin({
      template: 'src/template.html',
      filename: 'index.html',
      title: APP_CONFIG.title || '凹凸租车',
      inject: 'body', // 所有javascript资源将被注入至body底部
      minify: {
        removeComments: true, // 删除注释
        collapseWhitespace: true, // 压缩成一行
        removeAttributeQuotes: false // 删除引号
      },
      chunksSortMode: 'dependency' // 按照不同文件的依赖关系来排序
    }),

    new InlineScriptPlugin('runtime'),

    new InlineScriptPlugin('flexible'),

    // 提取公共样式
    new MiniCssExtractPlugin({
      // chunkFilename: "css/[name].[hash:7].css",
      filename: isDev ? 'css/[name].css' : 'css/[name].[contenthash:7].css',
      allChunks: true
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
      staticFileGlobsIgnorePatterns: [
        /\.map$/,
        /\.html$/,
        /asset-manifest\.json$/
      ]
    })
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.scss', '.css', '.mass'],
    alias: {
      src: resolve('src'),
      '@': resolve('src'),
      auto: resolve('src/auto'),
      $assets: resolve('src/assets'),
      $components: resolve('src/components'),
      $containers: resolve('src/containers'),
      $redux: resolve('src/redux'),
      $views: resolve('src/views')
    }
  }
}

module.exports = webpackConfig
