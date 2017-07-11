let {
  css,
  merge,
  mixins,
  variables
} = require('../../lib/css')

const listStyle = {
  listStyle: 'none',
  padding: 0,
  margin: 0
}

module.exports = css(merge(mixins.pageLayout, {
  upload: mixins.buttonSecondary,
  jobs: listStyle,
  nudj: mixins.button,
  pageHeadlineHighlight: merge(mixins.pageLayout.pageHeadline, {
    color: variables.colors.royalBlue,
    padding: '0'
  })
}))
