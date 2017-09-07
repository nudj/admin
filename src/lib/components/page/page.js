const React = require('react')
const { Helmet } = require('react-helmet')
const getStyle = require('./page.css')
const Header = require('../header/header')
const Message = require('../message/message')
const Notification = require('../notification/notification')
const Overlay = require('../overlay/overlay')

class Page extends React.Component {
  render () {
    const style = getStyle()
    return (
      <div className={`${this.props.className} ${style.body}`}>
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
          <Message message={this.props.message} />
          <Notification notification={this.props.notification} dispatch={this.props.dispatch} />
          {this.props.children}
        </div>
        <Overlay overlay={this.props.overlay} dispatch={this.props.dispatch} />
      </div>
    )
  }
}

module.exports = Page
