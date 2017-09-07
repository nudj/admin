let {
  css,
  merge,
  mixins,
  variables
} = require('../../app/lib/css')

const listStyle = {
  listStyle: 'none',
  padding: 0,
  margin: 0
}

module.exports = css(merge(mixins.pageLayout, mixins.formStructure, mixins.formElements, {
  upload: mixins.buttonSecondary,
  jobs: listStyle,
  hirers: merge(listStyle, {
    display: 'flex',
    flexWrap: 'wrap'
  }),
  nudj: mixins.button,
  pageHeadlineHighlight: merge(mixins.pageLayout.pageHeadline, {
    color: mixins.secondaryColor,
    padding: '0'
  }),
  formCard: mixins.cardStyle,
  missing: mixins.cardStyle,
  missingGroup: {
    padding: `0 0 ${variables.padding.d} 0`,
    [mixins.breakpoints.l]: {
      alignItems: 'flex-start',
      display: 'flex'
    }
  },
  copyLink: mixins.buttonSecondary,
  copyLinkNew: merge(mixins.buttonSecondary, {
    [mixins.breakpoints.l]: {
      margin: `0 0 0 ${variables.padding.d}`
    }
  }),
  inputBox: merge(mixins.formElements.inputBox, {
    flexGrow: '1',
    width: '100%'
  })
}))
