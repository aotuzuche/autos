import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import actions from 'src/redux/actions'

const mapStateToProps = state => ({
  ...state
})

const mapDispatchToProps = dispatch => {
  let list = {}
  for (let i in actions) {
    if (actions.hasOwnProperty(i)) {
      list[i] = bindActionCreators(actions[i], dispatch)
    }
  }
  return list
}

export default Component =>
  connect(mapStateToProps, mapDispatchToProps)(Component)
