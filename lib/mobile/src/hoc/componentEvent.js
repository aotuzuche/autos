/**
 * 在组件中用装饰器的方式捆绑事件类
 * 使用方式：
 * 1. @ComponentEvent('evt', Event) // 事件方式捆绑到命名空间中
 * 2. @ComponentEvent(Event) // 事件直接绑定到this
 * @param ns namespace
 * @param Event event class
 *
 * Event在写类方法的时候要注意两点：
 * 1. 第二种方式只能使用箭头函数(不推荐使用这种方式)
 * 2. 不要在组件的构造函数中调用
 *
 * @returns {function(*)} component
 */
const ComponentEvent = (ns, Event) => Component => {
  class WithEvent extends Component {
    constructor(props) {
      super(props)

      // 第一种方式，将event类捆绑到ns上
      if (typeof ns === 'string' && typeof Event === 'function') {
        // 这样写的好处是event的类方法可以是用正常的类方法写，而不是一定要用箭头函数
        Event.prototype.__proto__ = this
        Event.prototype.constructor = Event
        // Event.prototype = this // 旧的写法
        this[ns] = new Event()
      }
      // 如果第二个参数没有，第一个参数是个func
      // 说明是第二种使用方式
      else if (typeof Event === 'undefined' && typeof ns === 'function') {
        const Event = ns
        Event.prototype = this
        const events = new Event()
        // 将所有的方法捆绑到this上
        // 不推荐，建议使用第一种方式，因为这种方式可能会覆盖掉其他同名方法
        Object.entries(events).forEach(e => {
          this[e[0]] = e[1]
        })
      }
      // 参数不正确
      else {
        throw new Error('arguments type error')
      }
    }
  }
  return WithEvent
}

export default ComponentEvent
