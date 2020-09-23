const webpack = require('webpack')
const { merge } = require('webpack-merge')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const config = require('../config')
const getBaseConfig = require('./baseConfig')
const { assetsPath } = require('../utils')

module.exports = async function getProdConfig(options) {
  const baseConfig = await getBaseConfig(options)

  return merge(baseConfig, {
    devtool: config[process.env.PACKAGE].productionSourceMap ? 'cheap-module-source-map' : false,
    optimization: {
      minimizer: [
        new OptimizeCSSAssetsPlugin({
          cssProcessorOptions: {
            safe: true,
          },
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
              evaluate: true,
            },
            mangle: {
              safari10: true,
            },
          },
          sourceMap: true,
          cache: true,
          parallel: true,
        }),
      ],
    },
    plugins: [
      // 启用范围提升，用于改进包的体积
      new webpack.optimize.ModuleConcatenationPlugin(),
    ],

    output: {
      path: config[process.env.PACKAGE].assetsRoot,
      filename: assetsPath('js/[name].[chunkhash].js'),
      chunkFilename: assetsPath('js/[name].[chunkhash].js'),
      publicPath: config[process.env.PACKAGE].assetsPublicPath,
    },

    stats: {
      cached: false,
      cachedAssets: false,
    },
  })
}
