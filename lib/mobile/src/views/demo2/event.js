import { Toast } from 'auto'

export default class Event {

  goBack = e => {
    this.props.history.goBack()
  }

  pop = e => {
    this.props.$demo.pop()
  }

  push = e => {
    this.props.$demo.push()
  }

  clear = e => {
    this.props.$demo.clear()
  }

  asyncPush = async e => {
    try {
      this.setState({
        loading: true,
      })

      await this.props.$demo.asyncPush()
    }
    catch (e) {
      Toast.show(e.msg)
    }
    finally {
      this.setState({
        loading: false,
      })
    }
  }

}
