import './style'
import React, { PureComponent } from 'react'
import VIEW from 'src/hoc/view'
import ComponentEvent from 'src/hoc/componentEvent'
import Event from './event'

@VIEW
@ComponentEvent('evt', Event)
export default class View extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      loading: false,
    }
  }

  render() {
    const list = this.props.$$demo.list

    return (
      <Layout className={'view-demo'}>
        <Layout.Header
          title={'Redux'}
          onBackClick={this.evt.goBack}
        />

        <Layout.Body>

          <div className={'buttons'}>
            <Button mini onClick={this.evt.pop}>
              Pop
            </Button>
            <Button mini onClick={this.evt.push}>
              Push
            </Button>
            <Button mini onClick={this.evt.clear}>
              Clear
            </Button>
            <Button loading={this.state.loading} mini onClick={this.evt.asyncPush}>
              Async Push
            </Button>
          </div>

          {
            list.length ?
              <Cell>
                {
                  list.map(res => (
                    <Cell.Row key={res}>
                      item: {res}
                    </Cell.Row>
                  ))
                }
              </Cell> :
              <p>empty</p>
          }

        </Layout.Body>

      </Layout>
    )
  }
}
