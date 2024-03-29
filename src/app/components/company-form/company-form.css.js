const { css, merge } = require('@nudj/framework/css')
const { mixins } = require('../../lib/css')

module.exports = css(merge(mixins.pageLayout, mixins.formStructure, mixins.formElements, {
  formCard: mixins.cardStyle,
  inputBox: merge(mixins.formElements.inputBox, {
    flexGrow: '1',
    width: '100%'
  })
}))
