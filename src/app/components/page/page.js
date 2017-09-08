const React = require('react')
const { Helmet } = require('react-helmet')
const get = require('lodash/get')

const getStyle = require('./page.css')
const ScrollTop = require('../scroll-top/scroll-top')
const ErrorPage = require('../error-page/error-page')
const Status = require('../status/status')
const Loading = require('../loading/loading')
const Header = require('../header/header')
const Message = require('../message/message')
const Notification = require('../notification/notification')
const Overlay = require('../overlay/overlay')

const Page = (props) => {
  const style = getStyle()
  const error = get(props, 'error')
  const loading = get(props, 'loading')

  if (error) {
    return (
      <Status code={error.code}>
        <ErrorPage {...props.page} />
      </Status>
    )
  }
  return (
    <ScrollTop ignore={props.historyAction === 'REPLACE'}>
      <div className={`${props.className} ${style.body}`}>
        <Helmet>
          <meta charSet='utf-8' />
          <title>ADMIN</title>
          <meta name='viewport' content='width=device-width, initial-scale=1' />
          <meta name='title' content='ADMIN' />
          <link rel='icon' href='/assets/images/nudj-square.ico' type='image/x-icon' />
          <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/normalize/7.0.0/normalize.min.css' />
          <link rel='stylesheet' href='/assets/css/reset.css' />
        </Helmet>
        <header className={style.header}>
          <Header />
        </header>
        <div className={style.content}>
          <Message message={props.message} />
          <Notification notification={props.notification} dispatch={props.dispatch} />
          {loading ? <Loading /> : props.children}
        </div>
        <Overlay overlay={props.overlay} dispatch={props.dispatch} />
      </div>
    </ScrollTop>
  )
}

module.exports = Page
