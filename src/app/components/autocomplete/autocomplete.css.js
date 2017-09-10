let {
  css,
  merge,
  mixins,
  variables
} = require('@nudj/framework/css')

module.exports = css(merge(mixins.pageLayout, {
  inputBoxHole: {
    flexGrow: '1'
  },
  inputBox: merge(mixins.formElements.inputBox, {
    width: '100%'
  }),
  suggestion: merge(mixins.headings.p, {
    color: variables.colors.pink,
    cursor: 'pointer'
  })
}))
