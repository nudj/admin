const { StyleSheet, css: _css } = require('aphrodite/no-important')
const variables = require('./variables')
const mixins = require('./mixins')
const { merge } = require('../../../lib')

const css = (stylesheet) => {
  return () => {
    const styles = StyleSheet.create(stylesheet)
    return Object.keys(stylesheet).reduce((classList, className) => {
      classList[className] = _css(styles[className])
      return classList
    }, {})
  }
}

module.exports = {
  css,
  merge,
  variables,
  mixins
}
