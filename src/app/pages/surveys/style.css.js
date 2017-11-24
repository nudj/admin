let {
  css,
  merge,
  mixins
} = require('@nudj/framework/css')

const styles = merge(mixins.pageLayout, mixins.formStructure, mixins.formElements, {})

module.exports = css(styles)
