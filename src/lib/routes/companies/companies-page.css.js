let {
  css,
  merge,
  mixins
} = require('../../app/lib/css')

const listStyle = {
  listStyle: 'none',
  padding: 0,
  margin: 0
}

module.exports = css(merge(mixins.pageLayout, mixins.formStructure, mixins.formElements, {
  upload: mixins.buttonSecondary,
  jobs: listStyle,
  nudj: mixins.button,
  formCard: mixins.cardStyle,
  inputBox: merge(mixins.formElements.inputBox, {
    flexGrow: '1',
    width: '100%'
  })
}))
