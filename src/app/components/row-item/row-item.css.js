const { css, merge } = require('@nudj/framework/css')
const { variables, mixins } = require('../../lib/css')

const listStyle = {
  listStyle: 'none',
  padding: 0,
  margin: 0
}

const styles = {
  row: merge(listStyle, mixins.cardStyle, {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    marginTop: variables.padding.e,
    minHeight: variables.padding.b,
    ':first-child': {
      margin: 0
    }
  }),
  title: merge(mixins.headings.h7, {
    color: variables.colors.pink,
    textDecoration: 'none',
    flex: 1
  }),
  details: {
    flex: 2,
    listStyle: 'none',
    display: 'flex'
  },
  detail: {
    listStyle: 'none',
    flex: 1,
    position: 'relative',
    paddingLeft: variables.padding.c,
    ':before': {
      content: '""',
      borderLeft: `${variables.sizing.detailSeparatorWidth} solid ${variables.colors.lightGrey}`,
      height: variables.padding.d,
      position: 'absolute',
      left: variables.padding.d,
      top: '50%',
      transform: 'translateY(-50%)'
    },
    ':first-child': {
      paddingLeft: 0,
      ':before': {
        display: 'none'
      }
    }
  },
  definition: {
    margin: 0
  },
  definitionTerm: merge(mixins.headings.h8, {
    color: variables.colors.charcoal,
    display: 'block'
  }),
  definitionDescription: merge(mixins.headings.small, {
    color: variables.colors.pink,
    display: 'block',
    margin: 0,
    wordBreak: 'break-word'
  }),
  actions: merge({
    flex: 0,
    width: '50%',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center'
  }, listStyle),
  action: listStyle
}

styles.rowHighlight = merge(styles.row, {
  border: `${variables.sizing.baseBorderWidth} solid ${variables.colors.pink}`
})

styles.rowSmall = merge(styles.row, {
  margin: `0 0 ${variables.padding.e} ${variables.padding.e}`,
  marginTop: '0',
  width: `calc(50% - ${variables.padding.f})`,
  ':first-child': {
    margin: `0 0 ${variables.padding.e} 0`
  },
  ':nth-child(odd)': {
    marginLeft: '0'
  }
})

module.exports = css(styles)
