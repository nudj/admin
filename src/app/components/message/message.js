const React = require('react')
const get = require('lodash/get')
const getStyle = require('./message.css')
const ScrollTop = require('../scroll-top/scroll-top')

const Message = (props) => {
  const style = getStyle()
  return <div className={style.wrapper}>
    {props.message ? <ScrollTop><div className={style[get(props, 'message.type')]}>
      <div className={style.copy}>{get(props, 'message.message')}</div>
    </div></ScrollTop> : ''}
  </div>
}

module.exports = Message
