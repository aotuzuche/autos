## [1.0.11](https://github.com/aotuzuche/autos/compare/v1.0.10...v1.0.11) (2019-06-06)


### Bug Fixes

* 🐛 修复 hmr 地址拼写错误 ([7694c6b](https://github.com/aotuzuche/autos/commit/7694c6b))



## [1.0.10](https://github.com/aotuzuche/autos/compare/v1.0.9...v1.0.10) (2019-05-23)


### Bug Fixes

* 🐛 修复 loader exclude 错误 ([c132634](https://github.com/aotuzuche/autos/commit/c132634))



## [1.0.9](https://github.com/aotuzuche/autos/compare/v1.0.8...v1.0.9) (2019-05-23)


### Bug Fixes

* 🐛 loader include 替换成 exclude,兼容性更好,增加 resolve.modules ([82a7ac1](https://github.com/aotuzuche/autos/commit/82a7ac1))



## [1.0.8](https://github.com/aotuzuche/autos/compare/v1.0.7...v1.0.8) (2019-05-15)


### Bug Fixes

* 🐛 base.js ([5b0a4f1](https://github.com/aotuzuche/autos/commit/5b0a4f1))



## [1.0.7](https://github.com/aotuzuche/autos/compare/v1.0.6...v1.0.7) (2019-05-15)


### Bug Fixes

* 🐛 package.json ([b6e8f37](https://github.com/aotuzuche/autos/commit/b6e8f37))



## [1.0.6](https://github.com/aotuzuche/autos/compare/v1.0.5...v1.0.6) (2019-05-15)


### Features

* 🎸 base.js ([b1ef41e](https://github.com/aotuzuche/autos/commit/b1ef41e))



## [1.0.5](https://github.com/aotuzuche/autos/compare/v1.0.4...v1.0.5) (2019-05-10)


### Bug Fixes

* 🐛 autos dev ([c2c800f](https://github.com/aotuzuche/autos/commit/c2c800f))



## [1.0.4](https://github.com/aotuzuche/autos/compare/v1.0.3...v1.0.4) (2019-05-07)


### Bug Fixes

* 🐛 build.js ([832e655](https://github.com/aotuzuche/autos/commit/832e655))



## [1.0.3](https://github.com/aotuzuche/autos/compare/v1.0.2...v1.0.3) (2019-05-07)


### Bug Fixes

* 🐛 base.js ([f371a07](https://github.com/aotuzuche/autos/commit/f371a07))



## [1.0.2](https://github.com/aotuzuche/autos/compare/v1.0.1...v1.0.2) (2019-05-07)


### Bug Fixes

* **base.js:** 增加 APP_CONFIG.includeFiles 逻辑 ([1f4c693](https://github.com/aotuzuche/autos/commit/1f4c693))


### Features

* 🎸 优化 base.js ([638797f](https://github.com/aotuzuche/autos/commit/638797f))



## [1.0.1](https://github.com/aotuzuche/autos/compare/v1.0.0...v1.0.1) (2019-04-22)


### Bug Fixes

* **base.js:** 修复 resolveLoader modules 路径报错 ([6033977](https://github.com/aotuzuche/autos/commit/6033977))
* **base.js:** 修复样式解析应用错误 ([13d87b2](https://github.com/aotuzuche/autos/commit/13d87b2))
* **build.js:** 去掉多余的 option ([56562d2](https://github.com/aotuzuche/autos/commit/56562d2))



# [1.0.0](https://github.com/aotuzuche/autos/compare/v0.1.18...v1.0.0) (2019-04-19)


### Bug Fixes

* **base.js:** 修复 loader 依赖查找路径 ([cd58fd3](https://github.com/aotuzuche/autos/commit/cd58fd3))
* **Dev.js:** 修复热更新不生效 ([86fb6f6](https://github.com/aotuzuche/autos/commit/86fb6f6))
* 修复 lint 报错 ([41c4c30](https://github.com/aotuzuche/autos/commit/41c4c30))


### Features

* 新增管理后台打包，优化了配置文件，项目为单位 ([4fc24f7](https://github.com/aotuzuche/autos/commit/4fc24f7))


### Performance Improvements

* **build.js:** 去掉 externals 参数 ([27222a6](https://github.com/aotuzuche/autos/commit/27222a6))
* **DEV:** 添加 openBrowser 方法，优化本地开发重复打开新的标签 ([ff7c389](https://github.com/aotuzuche/autos/commit/ff7c389))
* **package.json:** 去掉无用的依赖 ([55de8fe](https://github.com/aotuzuche/autos/commit/55de8fe))
* 优化 webpack 配置, 优化了 webpack 环境变量的设置 ([093910d](https://github.com/aotuzuche/autos/commit/093910d))
* 优化了 webpack 环境变量的设置 ([d48ef13](https://github.com/aotuzuche/autos/commit/d48ef13))



## [0.1.18](https://github.com/aotuzuche/autos/compare/v0.1.17...v0.1.18) (2019-02-21)


### Bug Fixes

* 修改 auto-ui 按需加载的文件夹目录 ([22f3b69](https://github.com/aotuzuche/autos/commit/22f3b69))


### Features

* 🎸 autos dev 下支持 appConfig.js proxy 参数，方便自定义代理 ([8752899](https://github.com/aotuzuche/autos/commit/8752899))


### Performance Improvements

* ⚡️ 抽出 deepMerge, 支持到数组的深度 merge ([fb0d8e2](https://github.com/aotuzuche/autos/commit/fb0d8e2))



## [0.1.17](https://github.com/aotuzuche/autos/compare/v0.1.16...v0.1.17) (2019-01-24)


### Bug Fixes

* 去掉 babel 中 import 配置的 style 引入，由组件引入 ([3f35421](https://github.com/aotuzuche/autos/commit/3f35421))
* **autos update:** 修复 deepmerge 的时候对数组没有做合并导致元素重复 ([c2fc165](https://github.com/aotuzuche/autos/commit/c2fc165))



## [0.1.16](https://github.com/aotuzuche/autos/compare/v0.1.15...v0.1.16) (2019-01-21)


### Bug Fixes

* 修复 css 样式没有转化 rem 的 bug ([a9be1c6](https://github.com/aotuzuche/autos/commit/a9be1c6))



## [0.1.15](https://github.com/aotuzuche/autos/compare/v0.1.14...v0.1.15) (2019-01-14)


### Bug Fixes

* 修复 auto-ui 打包相关的配置 ([3ed3577](https://github.com/aotuzuche/autos/commit/3ed3577))



## [0.1.14](https://github.com/aotuzuche/autos/compare/v0.1.13...v0.1.14) (2018-12-28)


### Bug Fixes

* **autos init:** 初始化新项目的时候去掉 yarn.lock 文件 ([f00643c](https://github.com/aotuzuche/autos/commit/f00643c))



## [0.1.13](https://github.com/aotuzuche/autos/compare/v0.1.12...v0.1.13) (2018-12-24)


### Features

* **autos lint:** 添加 --fix 参数 ([786f363](https://github.com/aotuzuche/autos/commit/786f363))



## [0.1.12](https://github.com/aotuzuche/autos/compare/v0.1.11...v0.1.12) (2018-12-04)


### Bug Fixes

* fix [@babel](https://github.com/babel)/plugin-proposal-decorators legacy没有导致编译错误 ([0c57ded](https://github.com/aotuzuche/autos/commit/0c57ded))



## [0.1.11](https://github.com/aotuzuche/autos/compare/v0.1.10...v0.1.11) (2018-12-04)


### Bug Fixes

* fix [@babel](https://github.com/babel)/plugin-proposal-decorators 未设置 decoratorsBeforeExport 导致编译报错 ([2469efb](https://github.com/aotuzuche/autos/commit/2469efb))



## [0.1.10](https://github.com/aotuzuche/autos/compare/v0.1.9...v0.1.10) (2018-12-04)


### Bug Fixes

* 修复 uglifyjs-webpack-plug 依赖不存在 ([53a0010](https://github.com/aotuzuche/autos/commit/53a0010))


### Performance Improvements

* eslint 添加 cache ,并且引入 cacheIdentifier 来识别缓存的有效 ([9578ae7](https://github.com/aotuzuche/autos/commit/9578ae7))



## [0.1.9](https://github.com/aotuzuche/autos/compare/v0.1.8...v0.1.9) (2018-10-31)


### Performance Improvements

* 改善代码构建后的信息展示,增加 Gzipped 信息展示,去掉图片等资源的信息展示 ([d37ff99](https://github.com/aotuzuche/autos/commit/d37ff99))



## [0.1.8](https://github.com/aotuzuche/autos/compare/v0.1.7...v0.1.8) (2018-10-31)


### Bug Fixes

* 修复 autos dev 模式下编译进度和报错信息不够饱满,去掉 happypack ([49f82ef](https://github.com/aotuzuche/autos/commit/49f82ef))



## [0.1.7](https://github.com/aotuzuche/autos/compare/v0.1.6...v0.1.7) (2018-10-29)


### Bug Fixes

* webpackDevServer options 添加 historyApiFallback, 修复 spa 页面路由报错 ([5c2c6c3](https://github.com/aotuzuche/autos/commit/5c2c6c3))



## [0.1.6](https://github.com/aotuzuche/autos/compare/v0.1.4...v0.1.6) (2018-10-29)


### Bug Fixes

* **autos lint:** 去掉内置 eslintrc 文件, eslint 配置文件放在 package.json 里面, 修复了编辑器不实时检测 ([a451331](https://github.com/aotuzuche/autos/commit/a451331))
* fix WebpackDevServer host 修改为 0.0.0.0 ([884592a](https://github.com/aotuzuche/autos/commit/884592a))



## [0.1.4](https://github.com/aotuzuche/autos/compare/v0.1.3...v0.1.4) (2018-10-26)


### Bug Fixes

* **autos create:** 修复创建的时候错误使用 path.resolve 导致创建错误的目录 ([3208f19](https://github.com/aotuzuche/autos/commit/3208f19))



## [0.1.3](https://github.com/aotuzuche/autos/compare/v0.1.2...v0.1.3) (2018-10-19)


### Bug Fixes

* 修复构建的时候 include 没有包含 auto-ui 目录导致构建失败 ([c14c6e8](https://github.com/aotuzuche/autos/commit/c14c6e8))



## [0.1.2](https://github.com/aotuzuche/autos/compare/v0.1.1...v0.1.2) (2018-10-09)


### Bug Fixes

* 修复构建的路径报错 ([bcc4aab](https://github.com/aotuzuche/autos/commit/bcc4aab))



## [0.1.1](https://github.com/aotuzuche/autos/compare/v0.1.0...v0.1.1) (2018-10-09)


### Bug Fixes

* 修复 babel-loader include 的文件 bug，修复 babel preset-env 中的 modules 没有设置导致导入模块报错 ([1c0e858](https://github.com/aotuzuche/autos/commit/1c0e858))



# [0.1.0](https://github.com/aotuzuche/autos/compare/v0.0.9...v0.1.0) (2018-10-09)


### Bug Fixes

* 去掉 test.js 测试代码 ([8406c0e](https://github.com/aotuzuche/autos/commit/8406c0e))


### Features

* 修改了仓库地址，统一放到组织下面去 ([d3d6f6f](https://github.com/aotuzuche/autos/commit/d3d6f6f))



## [0.0.9](https://github.com/aotuzuche/autos/compare/v0.0.8...v0.0.9) (2018-10-08)


### Bug Fixes

* **package.json:** 修复 scritps 中 changelog 命令错误不生成新的更新文档 ([91d3f19](https://github.com/aotuzuche/autos/commit/91d3f19))
* 删除无用的忽略规则 ([fd9df51](https://github.com/aotuzuche/autos/commit/fd9df51))


### Features

* 增加 autos lint 命令，修改 autos dev 中 eslint-loader 的配置，聚合 eslint 配置 ([61bf896](https://github.com/aotuzuche/autos/commit/61bf896))


### Performance Improvements

* 优化 autos init 的性能，提升命令行的交互,去掉一些无用依赖 ([b661a30](https://github.com/aotuzuche/autos/commit/b661a30))
* 优化 autos 开发和构建的代码 ([9e3623d](https://github.com/aotuzuche/autos/commit/9e3623d))
* 增加 command 错误处理，修改了 init 的异步写法 ([f9ef848](https://github.com/aotuzuche/autos/commit/f9ef848))
* 添加公用的 resolveProjectPath 和 resolveAutosPath 来获取项目路径和脚手架路径，并且优化了一些文件目录结构 ([c556996](https://github.com/aotuzuche/autos/commit/c556996))



## [0.0.8](https://github.com/aotuzuche/autos/compare/v0.0.7...v0.0.8) (2018-09-29)


### Bug Fixes

* gitignore 忽略规则错误导致文件不提交 ([ee876b8](https://github.com/aotuzuche/autos/commit/ee876b8))
* 去除 tinyimg-loader, tinypng 对并发数做了限制 ([6d4462f](https://github.com/aotuzuche/autos/commit/6d4462f))
* **package.json:** 修复 commit-msg ([9100005](https://github.com/aotuzuche/autos/commit/9100005))


### Features

* release 的时候增加 release:note ([2010339](https://github.com/aotuzuche/autos/commit/2010339))
* 添加 commitizen 和 cz-conventional-changelog ([acb49f2](https://github.com/aotuzuche/autos/commit/acb49f2))
* 添加 webpack-bundle-analyzer 帮助优化代码，通过参数 --analyzer 开启 ([31b8e62](https://github.com/aotuzuche/autos/commit/31b8e62))
* **package.json:** add ([8327380](https://github.com/aotuzuche/autos/commit/8327380))
* **package.json:** 增加 changelog 命令 ([4061303](https://github.com/aotuzuche/autos/commit/4061303))
* **update:** 完善 autos update 命令 ([0a44d58](https://github.com/aotuzuche/autos/commit/0a44d58))



## [0.0.7](https://github.com/aotuzuche/autos/compare/v0.0.6...v0.0.7) (2018-09-28)


### Bug Fixes

* eslint-loader 没有在依赖中报错 ([249e2c9](https://github.com/aotuzuche/autos/commit/249e2c9))



## [0.0.6](https://github.com/aotuzuche/autos/compare/v0.0.4...v0.0.6) (2018-09-28)


### Bug Fixes

* release.sh commit 信息不符合规范 ([7578ef4](https://github.com/aotuzuche/autos/commit/7578ef4))
* 去掉 verify-commit-msg log ([b562447](https://github.com/aotuzuche/autos/commit/b562447))



## 0.0.4 (2018-09-27)



