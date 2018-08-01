// polyfill
require('es6-promise').polyfill()
window.Set = require('es6-set')
window.Map = require('es6-map')

// reset css
import 'src/assets/css/reset'

// some utils
import 'src/utils/inputEvents'
import 'src/utils/dateFormat'

// at-app configure
import 'src/conf/at'

// base framework
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

// >>>
if (process.env.NODE_ENV !== 'production') {
  const { whyDidYouUpdate } = require('why-did-you-update')
  whyDidYouUpdate(React)
}
// <<<

// fastclick
import fastclick from 'fastclick'

fastclick.attach(document.body)

// store
import configureStore from 'src/redux/store'

const store = configureStore()

// routes
import Routers from 'src/routes'

// render to #root
render(
  <Provider store={store}>
    <Routers />
  </Provider>,
  document.getElementById('root'),
)

// >>>
module.hot && module.hot.accept()
import V from 'vconsole'

window.vc = new V()
// <<<
