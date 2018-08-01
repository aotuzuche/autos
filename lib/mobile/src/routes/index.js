import APP_CONFIG from '../../appConfig'

import React from 'react'
import AsyncComponent from 'src/hoc/asyncComponent'
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'

const ViewRedux = AsyncComponent(e => import('src/views/demo'))
const ViewRedux2 = AsyncComponent(e => import('src/views/demo2'))
// import ViewRedux from 'src/views/demo'

// 配置路由
const Routes = e => {
  return (
    <BrowserRouter basename={APP_CONFIG.basename}>
      <Switch>
        <Route exact path="/" component={ViewRedux} />
        <Route exact path="/index2" component={ViewRedux2} />
        <Redirect to="/index" />
      </Switch>
    </BrowserRouter>
  )
}

export default Routes
