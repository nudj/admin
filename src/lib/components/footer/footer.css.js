let { css, mixins, variables, merge } = require('../../lib/css')

const linkItem = merge({
  fontSize: '.875rem',
  textDecoration: 'underline',
  display: 'inline',
  padding: '1rem',
  margin: '.5rem .25rem',
  borderRadius: '.25rem',
  color: 'white',
  [variables.breakpoints.ns]: {
    border: 'solid .125rem white',
    textDecoration: 'none',
    display: 'inline-block',
    marginTop: '.25rem',
    marginBottom: '.25rem'
  }
}, mixins.link, mixins.grow)

module.exports = css({
  background: {
    backgroundColor: '#ff725c',
    width: '100%'
  },
  container: {
    width: '100%',
    maxWidth: '64rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
    color: 'white',
    margin: '0 auto',
    [variables.breakpoints.ns]: {
      padding: '4rem 0'
    }
  },
  copyright: {
    fontSize: '.875rem',
    display: 'block',
    textAlign: 'center',
    paddingTop: '2rem',
    maxWidth: '16rem',
    width: '100%',
    borderTop: 'solid .125rem #fff'
  },
  links: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    textAlign: 'center',
    margin: '0 auto',
    padding: '0 0 2rem 0',
    listStyleType: 'none',
    [variables.breakpoints.ns]: {
      alignItems: 'stretch'
    }
  },
  item: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    textAlign: 'center',
    padding: '.5rem .25rem',
    [variables.breakpoints.ns]: {
      width: '25%',
      paddingTop: '.25rem',
      paddingBottom: '.25rem'
    }
  },
  release: linkItem,
  roadmap: linkItem,
  hiring: linkItem,
  terms: linkItem,
  label: {
    textAlign: 'center',
    paddingTop: '.5rem',
    margin: 0,
    display: 'none',
    [variables.breakpoints.ns]: {
      display: 'inline-block'
    }
  }
})
