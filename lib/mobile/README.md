# AutoReactApp

## 目录结构：
```
|- dist 发布（可在根目录的appConfig.js中配置）
|- src 开发环境
|  |- template.html 入口模板文件
|  |- main.js 入口js文件，注入基础的依赖与模板
|  |- appConfig.js app的配置文件，主要配置basename、打包的出口目录这些
|  |- assets 素材包(样式、字体、图片等)
|    |- fonts
|    |- images
|    |- css
|  |- conf 配置文件，native的配置文件、cdn目录、微信的配置等（自行扩展）
|  |- hoc 高阶组件
|  |- utils 工具类（常用的token、http方法的封装都在这个包内）
|  |- redux
|    |- actions
|    |- reducers
|    |- store 配置的store
|    |- connect.js 连接组件与redux
|  |- routes 路由
|    |- index.js 路由配置文件
|  |- components 组件（展示组件）
|    |- [name]
|      |- index.js
|      |- style.scss
|  |- containers 容器组件（容器组件，一般不需要这一层）
|    |- [name]
|      |- index.js
|      |- style.scss
|  |- views 页面组件（页面展示组件，即多少页面就有多少个该组件）
|    |- [name]
|      |- event.js
|      |- index.js
|      |- style.scss
```

## 使用

```
// 安装npm包
$ yarn

// 安装完成之后
// 完成后浏览器将自动打开，或手动 localhost:3880
$ npm run dev
```

## 支持语法

### 生产环境自动剔除(使用webpack的loader实现)
```js

//>>>
console.log('该注释之间的代码在生产环境将自动删除')
//<<<

```

### do 表达式

```js
const Component = color =>
  <div className='myComponent'>
    {do {
      if (color === 'blue') { <BlueComponent/> }
      else if (color === 'red') { <RedComponent/> }
      else if (color === 'green') { <GreenComponent/> }
    }}
  </div>
```

### 对象支持 spread 操作符

```js
const obj1 = {
  name: "james",
  age: 27
}
const obj2 = {...obj1};
```

### 装饰器

```js
function nameMixin(target) {
  target.prototype.setName = function(name) {
    this.name = name;
    return this;
  };

  target.prototype.sayName = function() {
    console.log(this.name);
  };
}

function ageMixin(target) {
  target.prototype.setAge = function(age) {
    this.age = age;
    return this;
  };

  target.prototype.sayAge = function() {
    console.log(this.age);
  };
}

@nameMixin
@ageMixin
class People {}

var p = new People();
p.setName('peter').sayName(); // peter
p.setAge(18).sayAge(); // 18
```

### import() 动态加载

```js
import('./alert').then(init => init(dom))
```
