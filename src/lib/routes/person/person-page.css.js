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

module.exports = css(merge(mixins.pageLayout, mixins.formStructure, mixins.formElements, {
  upload: mixins.buttonSecondary,
  jobs: listStyle,
  copyLink: mixins.buttonSecondary,
  copyLinkNew: merge(mixins.buttonSecondary, {
    [mixins.breakpoints.l]: {
      margin: `0 0 0 ${variables.padding.d}`
    }
  }),
  nudj: mixins.button,
  nudjLink: merge({
    margin: `0 0 0 ${variables.padding.d}`
  }, mixins.button),
  pageMainContainer: {
    flexGrow: '1'
  },
  sectionDivider: merge(mixins.sectionDivider, {
    marginTop: variables.padding.c
  }),
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
  }
}))
