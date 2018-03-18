const React = require('react')
const { Helmet } = require('react-helmet')

const { css, mergeStyleSheets } = require('@nudj/components/lib/css')

const defaultStyleSheet = require('./style.css')
const Header = require('../page-header')
const Sidebar = require('../sidebar')
const Notification = require('../notification')
const Overlay = require('../overlay')
const ScrollTop = require('../scroll-top')

const Page = (props) => {
  const {
    styleSheet,
    history,
    overlay,
    notification,
    dispatch,
    title,
    description,
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
        <div className={css(style.main)}>
          <Header
            title={title}
            description={description}
          />
          <div className={css(style.body)}>
            {children}
          </div>
        </div>
      </div>
    </ScrollTop>
  )
}

module.exports = Page
