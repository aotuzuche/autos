import axios from 'axios'
import { clearToken, toLogin } from 'src/utils/token'


// type an error
function HttpError(message, data) {
  this.message = message
  this.name = 'HttpError'
  this.data = data || null
}
HttpError.prototype = new Error()
HttpError.prototype.constructor = HttpError


const config = {
  production: '/',
  development: 'proxy',
  test: '/'
}

/**
 * 获取config配置中的请求前置路径
 */
const baseURL = config[process.env.PACKAGE] ? config[process.env.PACKAGE] : config['development']

/**
 * 配置axios
 */
const http = axios.create({
  baseURL,
  headers: {
    Accept: 'application/json;version=3.0;compress=false',
    'Content-Type': 'application/json;charset=utf-8'
  },
  data: {}
})

/**
 * 请求拦截器，在发起请求之前
 */
http.interceptors.request.use(config => {
  return config
})

/**
 * 接口响应拦截器，在接口响应之后
 */
http.interceptors.response.use(
  config => {
    // 响应正常
    if (config.data.resCode === '000000') {
      return config.data.data
    }
    // 需要登录（没登录或登录过期）
    else if (config.data.resCode === '200008') {
      clearToken()
      toLogin()
      return false
    }
    // reject错误处理
    return Promise.reject(new HttpError(config.data.resMsg, config.data))
  },
  error => {
    // reject错误处理
    return Promise.reject(new HttpError('系统错误'))
  }
)

export default http
