const { StyleSheet, typography, sizes, colors } = require('@nudj/components/lib/css')

const styleSheet = StyleSheet.create({
  root: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    backgroundColor: colors.secondary,
    overflow: 'hidden',
    color: colors.text,
    paddingTop: sizes.regular,
    paddingBottom: sizes.regular
  },
  menu: {
    listStyleType: 'none',
    paddingLeft: 0,
    marginTop: 0,
    marginBottom: 0,
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  },
  menuItem: {
    ':nth-child(1) + *': {
      marginTop: sizes.regular
    },
    ':last-child': {
      // sets the last items to effectively be `justify-self: flex-end`
      // `justify-self: flex-end` doesn't seem to work though 🤷‍
      marginTop: 'auto'
    }
  },
  link: {
    ...typography.type.smallIi,
    display: 'block',
    textDecoration: 'none',
    color: colors.white,
    paddingTop: sizes.regular,
    paddingBottom: sizes.regular,
    ':hover': {
      backgroundColor: colors.secondaryLight
    }
  },
  headerLink: {
    ...typography.type.regular,
    textTransform: 'uppercase'
  },
  icon: {
    display: 'block',
    fontSize: '1.75em',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: sizes.smallIi
  }
})

module.exports = styleSheet
