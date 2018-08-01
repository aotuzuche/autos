const config = require('./conf')
const utils = require('./utils')
const webpack = require('webpack')
const merge = require('webpack-merge')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const Visualizer = require('webpack-visualizer-plugin')
const baseWebpackConfig = require('./webpack.base.conf')

// 针对发布环境修改配置
const webpackConfig = merge(baseWebpackConfig, {
  devtool: config[process.env.PACKAGE].productionSourceMap ? '#source-map' : false,
  optimization: {
    // 分割公共代码
    splitChunks: {
      automaticNameDelimiter: '-',
      name: true,
      maxAsyncRequests: 7,
      maxInitialRequests: 5,
      minChunks: 2,
      cacheGroups: {
        styles: {
          name: 'style',
          chunks: 'all',
          test: /\.[sm]?css$/,
          enforce: true,
        },
        vendor: {
          name: 'vendor',
          chunks: 'all',
          test: /[\\/]node_modules[\\/]/,
          priority: -10, // 设置优先级最低
          enforce: true,
        },
        polyfill: {
          name: 'polyfill',
          chunks: 'all',
          test: function (module, count) {
            return module.resource &&
              (/(\/|\@|\\)(babel-runtime|core-js)(\/|\\)/).test(module.resource)
          },
          enforce: true,
        },
        auto: {
          name: 'autoui',
          chunks: 'all',
          test: function (module, count) {
            return module.resource &&
              (/(\/|\@|\\)auto(\/|\\)/).test(module.resource)
          },
          enforce: true,
        },
      },
    },
    // 分割运行时代码
    runtimeChunk: {
      name: 'runtime',
    },
    // 压缩js和css
    minimizer: [
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          safe: true,
          // 以ios大于等于7安卓大于等于4.1开始兼容，优化压缩
          autoprefixer: {
            add: true,
            browsers: ['iOS >= 7', 'Android >= 4.1'],
          },
        },
      }),
      new UglifyJsPlugin({
        cache: true,
        parallel: true, // 多线程构建提升速度
        sourceMap: true, // set to true if you want JS source maps
      }),
    ],
  },
  plugins: [
    // 设置环境变量
    new webpack.DefinePlugin({
      'process.env.PACKAGE': JSON.stringify(process.env.PACKAGE),
    }),

    // 启用范围提升，用于改进包的体积
    new webpack.optimize.ModuleConcatenationPlugin(),

    // 将moduleid转为hash，提高缓存效果(没测试是将name转hash还是id转hash，应该是name，id的话就没意义了)
    new webpack.HashedModuleIdsPlugin(),

    // js包大小的报告，会生成stats.html于根目录下
    new Visualizer(),
  ],

  output: {
    jsonpFunction: '$_$', // 默认是webpackJsonp
    path: config[process.env.PACKAGE].assetsRoot,
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: utils.assetsPath('js/[name].[chunkhash].js'),
    publicPath: config[process.env.PACKAGE].assetsPublicPath,
  },

  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
    'axios': 'axios',
    'react-redux': 'ReactRedux',
    'react-router': 'ReactRouter',
    'react-router-dom': 'ReactRouterDOM',
    'redux': 'Redux',
    'redux-thunk': 'ReduxThunk',
    'seamless-immutable': 'Immutable',
    'js-cookie': 'Cookies',
    'fastclick': 'FastClick',
    'qs': 'Qs',
    'classnames': 'classNames',
  },
})


module.exports = webpackConfig
