const { css, merge } = require('@nudj/framework/css')
const { variables, mixins } = require('../../lib/css')

module.exports = css({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: '0 0 auto',
    background: variables.colors.white,
    padding: `0 ${variables.padding.d}`,
    height: variables.padding.b,
    width: '100%' // ?
  },
  main: {

  },
  title: merge(mixins.headings.h6, {
    color: variables.colors.pink,
    padding: `0 0 ${variables.padding.f} 0`
  }),
  subtitle: merge(mixins.headings.h8, {
    color: variables.colors.charcoal,
    textDecoration: 'none',
    margin: 0
  }),
  sub: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'flex-end'
  }
})
