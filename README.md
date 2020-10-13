# 凹凸脚手架

- [x] 远程下载模板
- [x] 支持创建 view 和 component
- [x] 支持在当前和新文件夹初始化项目
- [x] 支持覆盖, 删除, 合并
- [x] 优化创建模板的效率
- [x] 单独升级 webpack 打包目录
- [x] 简化配置，所有的可配置项暴露到`appConfig.js`
- [x] 支持自定义配置
- [x] 支持 eslint 测试
- [ ] 支持更新项目配置

```js
// appConfig.js

module.exports = {
  basename: `/${this.prodPathPrefix}/${this.prodPath}`,

  // 打包出口目录的前缀，注意：不需要以/开头
  prodPathPrefix: 'system',

  // 打包的出口目录(默认dist目录)
  prodPath: 'financialManagement',

  // 管理后台系统码
  syscode: 'financialManagement',

  // 本地测试端口，默认 3000
  port: 3000,

  // 本地代理环境地址
  target: 'http://github.com/',

  // 本地代理配置默认值，支持重写
  proxy: {
    '/proxy/*': {
      target: this.target,
      pathRewrite: {
        '^/proxy/': '/',
      },
      changeOrigin: true,
      secure: false,
    },
  },

  // html 文档的标题
  title: 'Autos',

  // 自定义 webpack 配置
  modify: (webpackConfig, { packageEnv }) => webpackConfig,

  // 自定义 tsconConfig 路径，默认 tsconfig.json
  tsConfigPath: 'tsconfig.json',

  // 增加转译路径，因为默认不包含 nodu_modules
  includeFiles: ['nodu_modules/some_module'],

  // 是否代理登录页(默认关闭)
  autoLogin: true,

  // 开启微前端(默认关闭)
  mfe: true,
}
```

## 快速开始

```bash
$ npm i autos -g
```

## 创建新项目

```bash
$ autos init
```

或者

```bash
$ autos i
```

## 创建组件或者页面

```bash
$ autos create
```

或者

```bash
$ autos c
```

## 开发项目

```bash
$ autos dev
```

## 发布项目

### 测试环境发布项目

```bash
$ autos build -t
```

或者

```bash
$ autos build --test
```

### 正式环境发布项目

```bash
$ autos build
```

## 实际项目中使用

```bash
$ yarn dev
$ yarn test
$ yarn prod
```

或者

```bash
$ npm run dev
$ npm run test
$ npm run prod
```

## 升级项目

升级项目配置

```bash
$ autos update
```

![update.gif](./assets/images/update.gif)

## 开启分析仪

查看构建完成后包含的依赖关系

```bash
$ autos build -t --analyzer
```
