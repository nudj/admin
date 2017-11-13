const React = require('react')
const get = require('lodash/get')
const omit = require('lodash/omit')
const ReactClipboard = require('react-clipboard.js')
const ClipboardButton = ReactClipboard.default || ReactClipboard

class CopyToClipboard extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      text: get(props, 'children'),
      original: get(props, 'children'),
      tally: 0
    }
    this.onSuccess = this.onSuccess.bind(this)
    this.reset = this.reset.bind(this)
  }
  onSuccess () {
    let onSuccess = get(this.props, 'onSuccess')
    onSuccess && onSuccess()
    this.setState({
      text: 'Copied!',
      tally: get(this.state, 'tally') + 1
    })
    setTimeout(this.reset, 3000)
  }
  reset () {
    const tally = get(this.state, 'tally') - 1
    const change = {
      tally
    }
    if (!tally) {
      change.text = get(this.state, 'original')
    }
    this.setState(change)
  }
  render () {
    let filteredProps = omit(this.props, [
      'children',
      'onSuccess'
    ])
    return <ClipboardButton {...filteredProps} onSuccess={this.onSuccess}>{get(this.state, 'text')}</ClipboardButton>
  }
}

module.exports = CopyToClipboard
