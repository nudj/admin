let {
  css,
  merge,
  mixins
} = require('@nudj/framework/css')

const listStyle = {
  listStyle: 'none',
  padding: 0,
  margin: 0
}

module.exports = css(merge(mixins.pageLayout, mixins.formStructure, mixins.formElements, {
  upload: mixins.buttonSecondary,
  jobs: listStyle,
  nudj: mixins.button,
  pageHeadlineHighlight: merge(mixins.pageLayout.pageHeadline, {
    color: mixins.secondaryColor,
    padding: '0'
  }),
  formCard: mixins.cardStyle
}))
