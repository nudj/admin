let {
  css,
  merge,
  mixins,
  variables
} = require('../../../framework/lib/css')

let linkStyle = {
  display: 'block',
  height: variables.sizing.fixedHeaderButtonSize,
  padding: `${variables.padding.e} 0`,
  width: variables.sizing.fixedHeaderButtonSize,
  textDecoration: 'none',
  ':before': {
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
    content: `''`,
    display: 'block',
    height: variables.sizing.fixedHeaderButtonIconSize,
    marginBottom: variables.padding.f
  }
}

module.exports = css({
  nav: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    background: variables.colors.pink,
    overflow: 'hidden',
    padding: `${variables.padding.d} 0`,
    color: variables.colors.charcoal
  },
  main: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'column'
  },
  home: {
    display: 'inline-block',
    width: variables.sizing.fixedHeaderButtonSize,
    textAlign: 'center',
    marginBottom: variables.sizing.fixedHeaderButtonIconSize,
    textDecoration: 'none'
  },
  brand: {
    maxWidth: '4rem', // ?
    paddingTop: variables.padding.f
  },
  menu: {
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  menuItem: merge(mixins.headings.small, {
    textAlign: 'center',
    fontSize: '10px', // ?
    marginTop: variables.padding.e,
    ':first-child': {
      marginTop: 0
    }
  }),
  admin: merge(mixins.headings.p, {
    color: variables.colors.white,
    padding: `${variables.padding.e} 0`,
    textDecoration: 'none',
    textTransform: 'uppercase'
  }),
  jobs: merge(linkStyle, {
    color: variables.colors.white,
    ':before': {
      backgroundImage: mixins.linkImage('business-24-px-outline-briefcase-24.svg')
    }
  }),
  candidates: merge(linkStyle, {
    color: variables.colors.white,
    ':before': {
      backgroundImage: mixins.linkImage('candidates.svg')
    }
  }),
  help: merge(linkStyle, {
    color: variables.colors.white,
    ':before': {
      backgroundImage: mixins.linkImage('ui-24-px-outline-2-alert-circle.svg')
    }
  }),
  sub: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  logout: merge(linkStyle, {
    color: variables.colors.white,
    ':before': {
      backgroundImage: mixins.linkImage('arrows-24-px-outline-2-circle-out.svg')
    }
  })
})
