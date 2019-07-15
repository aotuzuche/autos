const fs = require('fs')
const config = require('./config')
const APP_CONFIG = config.APP_CONFIG
const isSystem = config.isSystem
const utils = require('./utils')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const InlineScriptPlugin = require('./inline-script-plugin')
const isDev = process.env.NODE_ENV === 'development'
const getCacheConfig = require('./lib/getCacheConfig')
const webpack = require('webpack')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const merge = require('webpack-merge')
const getEnvs = require('./lib/getEnvs')
const {
  resolveProjectPath,
  resolveAutosPath,
  formatter,
  transformer
} = require('../lib/utils')

// 获取 eslint-loader 的缓存标识
const { cacheIdentifier } = getCacheConfig(
  'eslint-loader',
  {
    'eslint-loader': require('eslint-loader/package.json').version,
    eslint: require(resolveProjectPath('node_modules/eslint/package.json'))
      .version
  },
  [
    '.eslintrc.js',
    '.eslintrc.yaml',
    '.eslintrc.yml',
    '.eslintrc.json',
    '.eslintrc',
    'package.json'
  ]
)

// 获取 webpack 入口路径，支持 typescript
function resolveEntry() {
  const supportEntrySuffixs = ['js', 'jsx', 'ts', 'tsx']

  for (const suffix of supportEntrySuffixs) {
    const path = resolveProjectPath(`src/main.${suffix}`)
    if (fs.existsSync(path)) {
      return path
    }
  }
}

let webpackConfig = {
  mode: process.env.NODE_ENV,

  entry: [resolveEntry()],

  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(j|t)s[x]?$/,
        include: [resolveProjectPath('src')],
        use: [
          {
            loader: 'eslint-loader',
            options: {
              cache: true,
              cacheIdentifier,
              eslintPath: resolveProjectPath('node_modules/eslint')
            }
          }
        ]
      },
      {
        test: /\.js[x]?$/,
        use: [
          {
            loader: 'cache-loader',
            options: getCacheConfig(
              'babel-loader',
              {
                '@babel/core': require('@babel/core/package.json').version,
                'babel-loader': require('babel-loader/package.json').version,
                browserslist: require(resolveProjectPath('package.json'))
                  .browserslist
              },
              ['babel.config.js', '.browserslistrc']
            )
          },
          'thread-loader',
          'babel-loader'
        ],
        exclude: filepath => {
          if (
            APP_CONFIG.includeFiles &&
            Array.isArray(APP_CONFIG.includeFiles) &&
            APP_CONFIG.includeFiles.some(file =>
              new RegExp(file).test(filepath)
            )
          ) {
            return false
          }
          return /node_modules/.test(filepath)
        }
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
        use: isSystem
          ? [
            isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: [require('autoprefixer')()]
              }
            }
          ]
          : [
            isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                importLoaders: 2
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: [require('autoprefixer')()]
              }
            },
            'px2rem-loader?remUnit=100'
          ]
      },
      {
        test: /\.mcss$/,
        use: isSystem
          ? [
            isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                importLoaders: 2,
                modules: true,
                localIdentName: '[local]_[hash:base64:6]'
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: [require('autoprefixer')()]
              }
            },
            'sass-loader'
          ]
          : [
            isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                importLoaders: 3,
                modules: true,
                localIdentName: '[local]_[hash:base64:6]'
              }
            },
            'px2rem-loader?remUnit=100',
            {
              loader: 'postcss-loader',
              options: {
                plugins: [require('autoprefixer')()]
              }
            },
            'sass-loader'
          ]
      },
      {
        test: /\.scss$/,
        use: isSystem
          ? [
            isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                importLoaders: 2
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: [require('autoprefixer')()]
              }
            },
            'sass-loader'
          ]
          : [
            isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                importLoaders: 3
              }
            },
            'px2rem-loader?remUnit=100',
            {
              loader: 'postcss-loader',
              options: {
                plugins: [require('autoprefixer')()]
              }
            },
            'sass-loader'
          ]
      }
    ]
  },

  plugins: [
    new CaseSensitivePathsPlugin(),

    // 设置环境变量
    new webpack.DefinePlugin(getEnvs()),

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
      ],
      logger: stats => {}
    }),

    // 美化本地开发时的终端界面
    new FriendlyErrorsWebpackPlugin({
      additionalTransformers: [transformer],
      additionalFormatters: [formatter]
    })
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.scss', '.css', '.mass'],
    alias: {
      src: resolveProjectPath('src'),
      '@': resolveProjectPath('src'),
      $assets: resolveProjectPath('src/assets'),
      $components: resolveProjectPath('src/components'),
      $containers: resolveProjectPath('src/containers'),
      $redux: resolveProjectPath('src/redux'),
      $views: resolveProjectPath('src/views'),
      $utils: resolveProjectPath('src/utils')
    },
    modules: [
      resolveAutosPath('node_modules'),
      resolveProjectPath('node_modules'),
      'node_modules'
    ]
  },
  resolveLoader: {
    modules: [
      resolveAutosPath('node_modules'),
      resolveProjectPath('node_modules'),
      'node_modules'
    ]
  }
}

const tsconfigPath = resolveProjectPath('tsconfig.json')
if (fs.existsSync(tsconfigPath)) {
  webpackConfig = merge(webpackConfig, {
    module: {
      rules: [
        {
          test: /\.ts[x]?$/,
          use: [
            {
              loader: 'cache-loader',
              options: getCacheConfig(
                'ts-loader',
                {
                  typescript: require('typescript/package.json').version,
                  'ts-loader': require('ts-loader/package.json').version
                },
                'tsconfig.json'
              )
            },
            'thread-loader',
            'babel-loader',
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true,
                happyPackMode: true,
                configFile: resolveProjectPath('tsconfig.json')
              }
            }
          ],
          exclude: filepath => {
            if (
              APP_CONFIG.includeFiles &&
              Array.isArray(APP_CONFIG.includeFiles) &&
              APP_CONFIG.includeFiles.some(file =>
                new RegExp(file).test(filepath)
              )
            ) {
              return false
            }
            return /node_modules/.test(filepath)
          }
        }
      ]
    },
    plugins: [
      new ForkTsCheckerWebpackPlugin({
        formatter: 'codeframe',
        checkSyntacticErrors: true,
        tsconfig: resolveProjectPath('tsconfig.json')
      })
    ]
  })
}

module.exports = webpackConfig
