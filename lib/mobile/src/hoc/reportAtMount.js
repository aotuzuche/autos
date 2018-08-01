// 统计utm相关的数据的高阶组件
// 使用方式：
// 在view组件中导入并@ReportAtMount即可
// 当浏览器地址或cookie中有utm相关的字段，在componentDidMount时就会发送相关的数据给服务器

import cookie from 'js-cookie'

function report(data, url) {
  if (!data) {
    return
  }
  if (!url) {
    url = 'https://hm.baidu.com/hm.gif?date=' + (new Date() - 0)
  }
  // @see http://jsperf.com/new-image-vs-createelement-img
  let image = document.createElement('img')
  const items = []
  for (let key in data) {
    if (typeof data[key] !== 'undefined') {
      items.push(key + '=' + encodeURIComponent(data[key]))
    }
  }
  image.onload = image.onerror = function () {
    image = image.onload = image.onerror = null
  }
  image.src = url + (url.indexOf('?') < 0 ? '?' : '&') + items.join('&')
}

const ReportAtMountComponent = Comp => {
  class ReportAtMount extends Comp {
    componentDidMount() {
      if (super.componentDidMount) {
        super.componentDidMount()
      }

      const search = this.search
      // 这4个值中只要有一个不为空，那就存下来，为空的值存空值
      if (search.utm_source || search.utm_medium || search.utm_campaign || search.utm_term) {
        cookie.set('utm_source', search.utm_source || '')
        cookie.set('utm_medium', search.utm_medium || '')
        cookie.set('utm_campaign', search.utm_campaign || '')
        cookie.set('utm_term', search.utm_term || '')
      }

      // 从cookie中取出来，只要有一个不为空，那就发送出去
      const ck = cookie.get()
      if (ck.utm_source || ck.utm_medium || ck.utm_campaign || ck.utm_term) {
        const reportData = {}
        reportData.utm_source = ck.utm_source || ''
        reportData.utm_medium = ck.utm_medium || ''
        reportData.utm_campaign = ck.utm_campaign || ''
        reportData.utm_term = ck.utm_term || ''
        report(reportData)
      }
    }
  }
  return ReportAtMount
}

export default ReportAtMountComponent