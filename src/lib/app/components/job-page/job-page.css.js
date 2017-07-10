let {
  css,
  merge,
  mixins,
  variables
} = require('../../lib/css')

const cardChoiceIconSize = '46px'

const cardStyle = merge(mixins.cardStyle, {
  textAlign: 'center',
  marginLeft: variables.padding.e,
  ':first-child': {
    marginLeft: 0
  }
})

const cardContent = {
  ':before': {
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
    backgroundSize: 'contain',
    content: `''`,
    display: 'inline-block',
    height: cardChoiceIconSize,
    width: cardChoiceIconSize
  }
}

const jobActivityHighlight = merge(mixins.pageLayout.pageHeadline, {
  padding: '0'
})

const networkCell = merge(mixins.cardStyle, {
  borderRadius: '0',
  boxShadow: `0.5px 0.5px 0 0 ${variables.colors.genericBoxShadow}`,
  margin: `0 0 ${variables.padding.e} 0`,
  position: 'relative'
})

module.exports = css(merge(mixins.pageLayout, {
  headerLink: {
    color: variables.colors.charcoal,
    textDecoration: 'none'
  },
  copyLink: mixins.buttonSecondary,
  nudjLink: merge({
    margin: `0 0 0 ${variables.padding.d}`
  }, mixins.button),
  pageMain: {},
  pageMainContainer: {
    flexGrow: '1'
  },
  internal: cardStyle,
  external: cardStyle,
  internalContent: merge(cardContent, {
    ':before': {
      backgroundImage: mixins.linkImage('company.svg')
    }
  }),
  externalContent: merge(cardContent, {
    ':before': {
      backgroundImage: mixins.linkImage('network.svg')
    }
  }),
  title: merge(mixins.headings.h7, {
    color: variables.colors.royalBlue,
    marginTop: variables.padding.d,
    marginBottom: variables.padding.e
  }),
  description: merge(mixins.typography.p),
  button: merge(mixins.button, {
    display: 'inline-block'
  }),
  network: merge(mixins.deList, {
    borderCollapse: 'separate',
    borderSpacing: `0 ${variables.padding.e}`,
    padding: '0',
    width: '100%'
  }),
  networkRow: {},
  networkHead: merge(mixins.headings.p, {
    color: variables.colors.charcoalTint2,
    padding: `0 ${variables.padding.d} ${variables.padding.e} ${variables.padding.d}`,
    textAlign: 'left',
    textDecoration: 'underline'
  }),
  networkCell: merge(networkCell, {}),
  networkCellCapitalise: merge(networkCell, {
    textTransform: 'capitalize'
  }),
  networkCellName: merge(networkCell, {
    borderRadius: `${mixins.cardStyle.borderRadius} 0 0 ${mixins.cardStyle.borderRadius}`
  }),
  networkCellActions: merge(networkCell, {
    borderRadius: `0 ${mixins.cardStyle.borderRadius} ${mixins.cardStyle.borderRadius} 0`,
    textAlign: 'right'
  }),
  resendLink: mixins.button,
  sectionDivider: merge(mixins.sectionDivider, {
    marginTop: variables.padding.c
  }),
  jobActivities: {
    display: 'flex'
  },
  jobActivity: merge(cardStyle, {
    flexGrow: '1',
    textAlign: 'left'
  }),
  jobActivityTitle: mixins.typography.p,
  jobActivitySummary: mixins.typography.p,
  jobActivityHighlightPositive: jobActivityHighlight,
  jobActivityHighlightNegative: merge(jobActivityHighlight, {
    color: variables.colors.midRed
  }),
  jobActivityHighlightNeutral: merge(jobActivityHighlight, {
    color: variables.colors.midGrey
  }),
  jobActivityFooter: merge(mixins.headings.small, {
    color: variables.colors.lightGrey
  })
}))
