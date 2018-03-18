const React = require('react')
const { Helmet } = require('react-helmet')

const { css, mergeStyleSheets } = require('@nudj/components/lib/css')

const defaultStyleSheet = require('./style.css')
const Sidebar = require('../sidebar')
const Notification = require('../notification')
const Overlay = require('../overlay')
const ScrollTop = require('../scroll-top')

/*
module.exports.pageLayout = {
  pageBody: merge(headings.p, {
    background: variables.colors.grey,
    minHeight: '100vh'
  }),
  pageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 0,
    background: variables.colors.white,
    padding: `${variables.padding.e} ${variables.padding.d}`
  },
  pageHeadline: merge(headings.h5, {
    color: module.exports.mainColor,
    padding: `${variables.padding.c} ${variables.padding.d} ${variables.padding.d} ${variables.padding.d}`,
    margin: 0
  }),
  pageContent: {
    flex: 1,
    padding: `0 0 ${variables.padding.c} 0`,
    display: 'flex'
  },
  pageMain: {
    flex: 1,
    padding: `0 ${variables.padding.d}`,
    minWidth: '520px'
  },
  pageSidebar: {
    boxSizing: 'content-box',
    display: 'none',
    padding: '0',
    position: 'relative',
    [breakpoints.m]: {
      display: 'block',
      width: variables.sizing.squishedSidebarWidth
    },
    [breakpoints.l]: {
      padding: `0 ${variables.padding.d} 0 calc(${variables.padding.c} + ${variables.padding.d})`,
      width: variables.sizing.sidebarWidth
    }
  },
  textHighlight: {
    color: module.exports.secondaryColor
  }
}
*/

const Page = (props) => {
  const {
    styleSheet,
    history,
    overlay,
    notification,
    dispatch,
    children
  } = props

  const style = mergeStyleSheets(defaultStyleSheet, styleSheet)

  return (
    <ScrollTop ignore={history.action === 'REPLACE'}>
      <div className={css(style.root)}>
        <Helmet>
          <body className={css(style.htmlBody)} />
        </Helmet>
        <Notification notification={notification} dispatch={dispatch} />
        <Overlay overlay={overlay} dispatch={dispatch} />
        <Sidebar styleSheet={{ root: style.sidebar }} />
        <div className={css(style.content)}>
          {children}
        </div>
      </div>
    </ScrollTop>
  )
}

module.exports = Page
