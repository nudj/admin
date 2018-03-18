const { StyleSheet, typography, sizes, colors } = require('@nudj/components/lib/css')

const styleSheet = StyleSheet.create({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderBottomColor: colors.greyLight,
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    paddingLeft: sizes.smallI,
    paddingRight: sizes.smallI,
    paddingTop: sizes.smallIi,
    paddingBottom: sizes.smallIi,
    '@media(min-width: 34.25rem)': {
      paddingLeft: sizes.regular,
      paddingRight: sizes.regular
    }
  },
  title: {
    ...typography.type.largeI,
    color: colors.pink
  },
  description: {
    ...typography.type.smallI,
    fontWeight: typography.fontWeight.bold,
    color: colors.text
  },
  sub: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'flex-end'
  }
})

module.exports = styleSheet
