const React = require('react')
const get = require('lodash/get')
const getStyle = require('./message.css')

const Message = (props) => {
  const style = getStyle()
  return <div className={style.wrapper}>
    {props.message ? <div className={style[get(props, 'message.type')]}>
      <div className={style.copy}>{get(props, 'message.message')}</div>
    </div> : ''}
  </div>
}

module.exports = Message
