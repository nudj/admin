const { StyleSheet, colors } = require('@nudj/components/lib/css')

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
  content: {
    minHeight: '100vh',
    width: `calc(100vw - ${sidebarWidth})`
  }
})

module.exports = styleSheet
