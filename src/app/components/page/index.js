const React = require('react')
const get = require('lodash/get')

const getStyle = require('./style.css')
const FrameworkPage = require('@nudj/framework/page')
const Loading = require('../loading')
const Header = require('../header')

const Page = (props) => {
  const style = getStyle()
  const loading = get(props, 'loading')

  return (
    <FrameworkPage {...props}>
      <div className={`${props.className} ${style.body}`}>
        <header className={style.header}>
          <Header />
        </header>
        <div className={style.content}>
          {loading ? <Loading /> : props.children}
        </div>
      </div>
    </FrameworkPage>
  )
}

module.exports = Page
