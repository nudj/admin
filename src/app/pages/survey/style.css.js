let {
  css,
  merge,
  mixins,
  variables
} = require('@nudj/framework/css')

const styles = merge(mixins.pageLayout, mixins.formStructure, mixins.formElements, {
  link: merge({
    margin: `0 0 0 ${variables.padding.d}`
  }, mixins.button),
  field: {
    marginBottom: '1em'
  }
})

module.exports = css(styles)
