import at from 'at-js-sdk'

if (window.isApp) {
  // 禁止ios系统回弹
  at &&
    at.setWebviewBounces({
      isBounces: 0
    })
}
