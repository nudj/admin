const { StyleSheet, sizes, colors } = require('@nudj/components/lib/css')

const sidebarWidth = '7.5rem'

const styleSheet = StyleSheet.create({
  htmlBody: {
    backgroundColor: colors.greyLightest
  },
  root: {
    position: 'relative',
    backgroundColor: colors.greyLightest,
    minHeight: '100%',
    paddingLeft: sidebarWidth
  },
  sidebar: {
    height: '100%',
    left: 0,
    position: 'fixed',
    top: 0,
    width: sidebarWidth
  },
  main: {
    minHeight: '100vh',
    width: `calc(100vw - ${sidebarWidth})`
  },
  body: {
    marginTop: sizes.regular,
    paddingLeft: sizes.regular,
    paddingRight: sizes.regular,
    paddingBottom: sizes.regular
  }
})

module.exports = styleSheet
