## 0.0.5

- `autoprefixer` 加上 `browsers: ['iOS >= 7', 'Android >= 4.1']` 参数
- `FriendlyErrorsWebpackPlugin` 加上 `onErrors`
- 修复 babel 设置 `cacheDirectory` 报错
- 修复 dev-server 中 proxy 的 target
- dev-server 启动后自动在默认浏览浏览器打开项目
- 优化脚手架体积

### 2018-09-27 14:18:02

- 增加和完善 autos test/dev/build 命令
- 增加 autos update 命令

### 2018-08-30 16:27:42

1. fix 模板下载目录错误位置
2. 增加 create 的时候不在项目根目录提示
3. fix create 的时候替换 react 组件组件名首字母大写

### 2018-08-30 10:51:16

1. 增加脚手架强制版本升级
2. 增加 view 和 component 创建命令

### 2018-08-29 16:37:11

1. 替换 Handlebars 为 ejs
