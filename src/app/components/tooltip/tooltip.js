const React = require('react')
const getStyle = require('./tooltip.css')

const Tooltip = (props) => {
  const style = getStyle()
  return (<div className={style.tooltip} />)
}

module.exports = Tooltip
