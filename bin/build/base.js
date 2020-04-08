const fs = require('fs')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development'
const webpack = require('webpack')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const merge = require('webpack-merge')
const getCacheConfig = require('./lib/getCacheConfig')
const InlineScriptPlugin = require('./inline-script-plugin')
const utils = require('./utils')
const getEnvs = require('./lib/getEnvs')
const config = require('./config')

const { APP_CONFIG } = config
const { isSystem } = config
const { resolveProjectPath, resolveAutosPath, formatter, transformer } = require('../lib/utils')

// 获取 webpack 入口路径，支持 typescript
function resolveEntry() {
  const supportEntrySuffixs = ['js', 'jsx', 'ts', 'tsx']

  // eslint-disable-next-line no-restricted-syntax
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
        test: /\.js[x]?$/,
        use: [
          {
            loader: 'cache-loader',
            options: getCacheConfig(
              'babel-loader',
              {
                '@babel/core': require('@babel/core/package.json').version,
                'babel-loader': require('babel-loader/package.json').version,
                browserslist: require(resolveProjectPath('package.json')).browserslist,
              },
              ['babel.config.js', '.browserslistrc'],
            ),
          },
          'thread-loader',
          'babel-loader',
        ],
        exclude: filepath => {
          if (
            APP_CONFIG.includeFiles &&
            Array.isArray(APP_CONFIG.includeFiles) &&
            APP_CONFIG.includeFiles.some(file => new RegExp(file).test(filepath))
          ) {
            return false
          }
          return /node_modules/.test(filepath)
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]'),
          publicPath: config[process.env.PACKAGE].cssAssetsPath,
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: utils.assetsPath('img/[name].[hash:7].[ext]'),
              publicPath: config[process.env.PACKAGE].cssAssetsPath,
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: isSystem
          ? [
              isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 1,
                },
              },
              {
                loader: 'postcss-loader',
                options: {
                  plugins: [require('autoprefixer')()],
                },
              },
            ]
          : [
              isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 2,
                },
              },
              {
                loader: 'postcss-loader',
                options: {
                  plugins: [require('autoprefixer')()],
                },
              },
              'px2rem-loader?remUnit=100',
            ],
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
                  localIdentName: '[local]_[hash:base64:6]',
                },
              },
              {
                loader: 'postcss-loader',
                options: {
                  plugins: [require('autoprefixer')()],
                },
              },
              'sass-loader',
            ]
          : [
              isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 3,
                  modules: true,
                  localIdentName: '[local]_[hash:base64:6]',
                },
              },
              'px2rem-loader?remUnit=100',
              {
                loader: 'postcss-loader',
                options: {
                  plugins: [require('autoprefixer')()],
                },
              },
              'sass-loader',
            ],
      },
      {
        test: /\.scss$/,
        use: isSystem
          ? [
              isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 2,
                },
              },
              {
                loader: 'postcss-loader',
                options: {
                  plugins: [require('autoprefixer')()],
                },
              },
              'sass-loader',
            ]
          : [
              isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 3,
                },
              },
              'px2rem-loader?remUnit=100',
              {
                loader: 'postcss-loader',
                options: {
                  plugins: [require('autoprefixer')()],
                },
              },
              'sass-loader',
            ],
      },
    ],
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
        removeAttributeQuotes: false, // 删除引号
      },
      chunksSortMode: 'dependency', // 按照不同文件的依赖关系来排序
    }),

    new InlineScriptPlugin('runtime'),

    new InlineScriptPlugin('flexible'),

    // 提取公共样式
    new MiniCssExtractPlugin({
      // chunkFilename: "css/[name].[hash:7].css",
      filename: isDev ? 'css/[name].css' : 'css/[name].[contenthash:7].css',
      allChunks: true,
    }),

    // 美化本地开发时的终端界面
    new FriendlyErrorsWebpackPlugin({
      additionalTransformers: [transformer],
      additionalFormatters: [formatter],
    }),

    // Ignore moment locale
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ],
  resolve: {
    extensions: ['tsx', 'ts', '.jsx', '.js', '.scss', '.css', '.mass'],
    alias: {
      src: resolveProjectPath('src'),
      '@': resolveProjectPath('src'),
      $assets: resolveProjectPath('src/assets'),
      $components: resolveProjectPath('src/components'),
      $containers: resolveProjectPath('src/containers'),
      $redux: resolveProjectPath('src/redux'),
      $views: resolveProjectPath('src/views'),
      $utils: resolveProjectPath('src/utils'),
    },
    modules: [resolveAutosPath('node_modules'), resolveProjectPath('node_modules'), 'node_modules'],
  },
  resolveLoader: {
    modules: [resolveAutosPath('node_modules'), resolveProjectPath('node_modules'), 'node_modules'],
  },
}

/**
 * 如果项目配置文件有配置 tsConfigPath 或者根目录有 tsconfig.json 文件，那么说明是 ts 项目，启用 ts-loader
 */
const tsconfigPath = resolveProjectPath(APP_CONFIG.tsConfigPath || 'tsconfig.json')
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
                  typescript: require(`${resolveProjectPath()}/node_modules/typescript/package.json`)
                    .version,
                  'ts-loader': require('ts-loader/package.json').version,
                },
                'tsconfig.json',
              ),
            },
            'thread-loader',
            'babel-loader',
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true,
                happyPackMode: true,
                configFile: resolveProjectPath('tsconfig.json'),
              },
            },
          ],
          exclude: filepath => {
            if (
              APP_CONFIG.includeFiles &&
              Array.isArray(APP_CONFIG.includeFiles) &&
              APP_CONFIG.includeFiles.some(file => new RegExp(file).test(filepath))
            ) {
              return false
            }
            return /node_modules/.test(filepath)
          },
        },
      ],
    },
    plugins: [
      new ForkTsCheckerWebpackPlugin({
        formatter: 'codeframe',
        checkSyntacticErrors: true,
        tsconfig: resolveProjectPath('tsconfig.json'),
      }),
    ],
  })
}

module.exports = webpackConfig
