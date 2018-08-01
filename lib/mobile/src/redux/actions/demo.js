import { createAction } from 'easy-action'
// import http from 'src/utils/http'

const pop = createAction('DEMO_POP')
const push = createAction('DEMO_PUSH')
const clear = createAction('DEMO_CLEAR')

// 异步处理
const _asyncPush = createAction('DEMO_ASYNC_PUSH')



const asyncPush = (payload = {}) => async (dispatch) => {
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      Math.random() < 0.5 ? reject(new Error('error?! try again!')) : resolve()
    }, 1000)
  })

  dispatch(_asyncPush())
}


export default {
  asyncPush,
  pop,
  push,
  clear
}
