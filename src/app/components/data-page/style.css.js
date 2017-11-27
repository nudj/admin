const {
  css,
  merge,
  mixins,
  variables
} = require('@nudj/framework/css')

const styles = merge(mixins.pageLayout, mixins.formStructure, mixins.formElements, {
  link: merge({
    margin: `0 0 0 ${variables.padding.d}`
  }, mixins.button)
})

module.exports = css(styles)
