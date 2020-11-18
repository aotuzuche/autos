const fs = require('fs')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const { merge } = require('webpack-merge')
const { ModuleFederationPlugin } = require('webpack').container
const { resolveProjectPath, resolveAutosPath, formatter, transformer } = require('../lib/utils')
const utils = require('../utils')
const getEnvs = require('../lib/getEnvs')
const config = require('../config')
const resolveEntry = require('../lib/resolveEntry')

const getBaseConfig = async () => {
  const isDev = process.env.NODE_ENV === 'development'
  const { APP_CONFIG } = config
  const deps = require(resolveProjectPath('package.json')).dependencies
  const isMfe = !!APP_CONFIG.mfe

  const styleRules = [
    isMfe || isDev
      ? {
          loader: 'style-loader',
          options: {
            esModule: false,
            injectType: 'singletonStyleTag',
            attributes: { id: `${APP_CONFIG.syscode}Style` },
          },
        }
      : {
          loader: MiniCssExtractPlugin.loader,
          options: {
            esModule: false,
          },
        },
    {
      loader: 'css-loader',
      options: {
        auto: /\.mcss$/,
        localIdentName: '[local]_[hash:base64:6]',
      },
    },
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: { plugins: [require('autoprefixer')()] },
      },
    },
  ]

  let webpackConfig = {
    mode: process.env.NODE_ENV,

    entry: [resolveEntry()],

    module: {
      rules: [
        {
          test: /\.m?js/,
          resolve: {
            fullySpecified: false,
          },
        },
        {
          test: /\.js[x]?$/,
          use: [
            'thread-loader',
            {
              loader: 'babel-loader',
              options: {
                plugins: [isDev && require.resolve('react-refresh/babel')].filter(Boolean),
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
                esModule: false,
              },
            },
          ],
        },
        {
          test: /\.css$/,
          use: styleRules,
        },
        {
          test: /\.mcss$/,
          use: [...styleRules, 'sass-loader'],
        },
        {
          test: /\.scss$/,
          use: [...styleRules, 'sass-loader'],
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
        minify: {
          removeComments: true, // 删除注释
          collapseWhitespace: true, // 压缩成一行
          removeAttributeQuotes: false, // 删除引号
        },
      }),

      // 提取公共样式
      !isMfe &&
        new MiniCssExtractPlugin({
          filename: isDev ? `css/[name].css` : `css/[name].[contenthash:7].css`,
          chunkFilename: isDev ? `css/[id].css` : `css/[id].[contenthash:7].css`,
          ignoreOrder: true,
        }),

      // 美化本地开发时的终端界面
      new FriendlyErrorsWebpackPlugin({
        additionalTransformers: [transformer],
        additionalFormatters: [formatter],
      }),

      // Ignore moment locale
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

      // 注册微前端服务
      isMfe &&
        new ModuleFederationPlugin({
          name: APP_CONFIG.syscode,
          // library: { type: 'var', name: APP_CONFIG.syscode },
          remotes: {
            layout: `layout@${APP_CONFIG.layout || '/system/layout/'}remoteEntry.js`,
          },
          filename: 'remoteEntry.js',
          exposes: {
            Routes: './src/routes',
            './bootstrap': './src/bootstrap',
          },
          shared: {
            ...deps,
            react: {
              eager: true,
              singleton: true,
              requiredVersion: deps.react,
            },
            'react-dom': {
              eager: true,
              singleton: true,
              requiredVersion: deps['react-dom'],
            },
          },
        }),
    ].filter(Boolean),
    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js', '.scss', '.css', '.mass'],
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
      modules: [
        'node_modules',
        resolveAutosPath('node_modules'),
        resolveProjectPath('node_modules'),
      ],
    },
    resolveLoader: {
      modules: [
        'node_modules',
        resolveAutosPath('node_modules'),
        resolveProjectPath('node_modules'),
      ],
    },
  }

  /**
   * 如果项目配置文件有配置 tsConfigPath 或者根目录有 tsconfig.json 文件，那么说明是 ts 项目，启用 ts-loader
   */
  const tsconfigPath = resolveProjectPath(APP_CONFIG.tsConfigPath || 'tsconfig.json')
  if (fs.existsSync(tsconfigPath)) {
    const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
    webpackConfig = merge(webpackConfig, {
      module: {
        rules: [
          {
            test: /\.ts[x]?$/,
            use: [
              'thread-loader',
              {
                loader: 'babel-loader',
                options: {
                  plugins: [isDev && require.resolve('react-refresh/babel')].filter(Boolean),
                },
              },
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
          typescript: {
            context: resolveProjectPath(),
            configFile: resolveProjectPath('tsconfig.json'),
          },
        }),
      ],
    })
  }

  return webpackConfig
}

module.exports = getBaseConfig
