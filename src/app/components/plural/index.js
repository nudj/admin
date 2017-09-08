const React = require('react')
const get = require('lodash/get')

const Plural = (props) => {
  const count = get(props, 'count', 0)
  const singular = get(props, 'singular', '')
  const plural = get(props, 'plural', singular)
  const zero = get(props, 'zero', plural)

  if (count === 0) {
    return (<span>{zero}</span>)
  } else if (count > 1) {
    return (<span>{plural}</span>)
  }
  return (<span>{singular}</span>)
}

module.exports = Plural
