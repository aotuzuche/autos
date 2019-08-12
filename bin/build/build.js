const config = require('./config')
const utils = require('./utils')
const webpack = require('webpack')
const merge = require('webpack-merge')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const baseWebpackConfig = require('./base')
const PreloadWebpackPlugin = require('preload-webpack-plugin')
const APP_CONFIG = config.APP_CONFIG

// 针对发布环境修改配置
let webpackConfig = merge(baseWebpackConfig, {
  devtool: config[process.env.PACKAGE].productionSourceMap
    ? '#source-map'
    : false,
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
          enforce: true
        },
        vendor: {
          name: 'vendor',
          chunks: 'all',
          test: /[\\/]node_modules[\\/]/,
          priority: -10, // 设置优先级最低
          enforce: true
        },
        async: {
          // key 为entry中定义的 入口名称
          chunks: 'async', // 必须三选一： "initial"(初始化) | "all" | "async"(默认就是异步)
          name: 'async-common', // 要缓存的 分隔出来的 chunk 名称
          minChunks: 2,
          enforce: true,
          reuseExistingChunk: true // 可设置是否重用已用chunk 不再创建新的chunk
        },
        polyfill: {
          name: 'polyfill',
          chunks: 'all',
          test: function(module, count) {
            return (
              module.resource &&
              /(\/|\@|\\)(babel-runtime|core-js)(\/|\\)/.test(module.resource)
            )
          },
          enforce: true
        },
        auto: {
          name: 'autoui',
          chunks: 'all',
          test: function(module, count) {
            return (
              module.resource &&
              /(\/|\@|\\)auto-ui(\/|\\)/.test(module.resource)
            )
          },
          enforce: true
        },
        flexible: {
          name: 'flexible',
          chunks: 'all',
          test: /flexible\.js$/,
          enforce: true
        }
      }
    },
    // 分割运行时代码
    runtimeChunk: {
      name: 'runtime'
    },
    // 压缩js和css
    minimizer: [
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          safe: true
        }
      }),
      new TerserPlugin({
        terserOptions: {
          compress: {
            // turn off flags with small gains to speed up minification
            arrows: false,
            collapse_vars: false, // 0.3kb
            comparisons: false,
            computed_props: false,
            hoist_funs: false,
            hoist_props: false,
            hoist_vars: false,
            inline: false,
            loops: false,
            negate_iife: false,
            properties: false,
            reduce_funcs: false,
            reduce_vars: false,
            switches: false,
            toplevel: false,
            typeofs: false,

            // a few flags with noticable gains/speed ratio
            // numbers based on out of the box vendor bundle
            booleans: true, // 0.7kb
            if_return: true, // 0.4kb
            sequences: true, // 0.7kb
            unused: true, // 2.3kb

            // required features to drop conditional branches
            conditionals: true,
            dead_code: true,
            evaluate: true
          },
          mangle: {
            safari10: true
          }
        },
        sourceMap: true,
        cache: true,
        parallel: true
      })
    ]
  },
  plugins: [
    new PreloadWebpackPlugin({
      rel: 'preload',
      include: 'initial',
      fileBlacklist: [/\.map$/, /hot-update\.js$/, /flexible/, /runtime/]
    }),

    new PreloadWebpackPlugin({
      rel: 'prefetch',
      include: 'asyncChunks'
    }),

    // 启用范围提升，用于改进包的体积
    new webpack.optimize.ModuleConcatenationPlugin(),

    // 将moduleid转为hash，提高缓存效果(没测试是将name转hash还是id转hash，应该是name，id的话就没意义了)
    new webpack.HashedModuleIdsPlugin()
  ],

  output: {
    jsonpFunction: '$_$', // 默认是webpackJsonp
    path: config[process.env.PACKAGE].assetsRoot,
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: utils.assetsPath('js/[name].[chunkhash].js'),
    publicPath: config[process.env.PACKAGE].assetsPublicPath
  }
})

/**
 * 增加自定义配置功能
 */

if (APP_CONFIG.modify && typeof APP_CONFIG.modify === 'function') {
  webpackConfig = APP_CONFIG.modify(webpackConfig, {
    packageEnv: process.env.PACKAGE
  })
}

module.exports = webpackConfig
