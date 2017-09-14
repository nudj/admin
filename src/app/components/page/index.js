const React = require('react')
const get = require('lodash/get')

const getStyle = require('./style.css')
const Header = require('../header')
const Notification = require('../notification')
const Overlay = require('../overlay')
const ScrollTop = require('../scroll-top')

const Page = (props) => {
  const style = getStyle()
  const loading = get(props, 'loading')

  return (
    <ScrollTop ignore={props.historyAction === 'REPLACE'}>
      <div className={`${props.className} ${style.body}`}>
        <Notification notification={props.notification} dispatch={props.dispatch} />
        <Overlay overlay={props.overlay} dispatch={props.dispatch} />
        <header className={style.header}>
          <Header />
        </header>
        <div className={style.content}>
          {props.children}
        </div>
      </div>
    </ScrollTop>
  )
}

module.exports = Page
