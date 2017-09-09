const React = require('react')
const { connect } = require('react-redux')
const serialise = require('form-serialize')
const omit = require('lodash/omit')
const { postData } = require('../../../framework/redux/actions/app')

function getSubmitHandler (props) {
  return (event) => {
    event.preventDefault()
    props.onSubmit && props.onSubmit(event)
    props.dispatch(postData({
      url: props.action,
      method: props.method,
      data: serialise(event.target, { hash: true })
    }))
  }
}

const Form = (props) => {
  let filteredProps = omit(props, ['dispatch'])
  return <form {...filteredProps} method={props.method || 'post'} onSubmit={getSubmitHandler(props)}>
    {props.children}
  </form>
}

module.exports = connect()(Form)
