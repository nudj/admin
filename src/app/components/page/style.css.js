let {
  css,
  merge,
  mixins,
  variables
} = require('../../../framework/lib/css')

module.exports = css({
  body: merge({
    minHeight: '100vh',
    paddingLeft: variables.sizing.fixedHeaderWidth,
    position: 'relative'
  }, mixins.sansSerif),
  header: merge({
    height: '100%',
    left: 0,
    position: 'fixed',
    top: 0,
    width: variables.sizing.fixedHeaderWidth
  }, mixins.sansSerif),
  content: {
    minHeight: '100vh',
    width: `calc(100vw - ${variables.sizing.fixedHeaderWidth})`
  }
})
