const { css, merge } = require('@nudj/framework/css')
const { variables, mixins } = require('../../lib/css')

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
