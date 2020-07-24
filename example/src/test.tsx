import * as React from 'react'

export default class Text extends React.Component {
  render() {
    return <div>{this.props.children}-Class</div>
  }
}

// export default function Text(props: any) {
//   return <div>{props.children}-function</div>
// }
