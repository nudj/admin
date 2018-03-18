const React = require('react')
const { css, mergeStyleSheets } = require('@nudj/components/lib/css')

const defaultStyleSheet = require('./style.css')

const Header = (props) => {
  const {
    title,
    description,
    children,
    styleSheet
  } = props

  const style = mergeStyleSheets(defaultStyleSheet, styleSheet)

  return (
    <header className={css(style.root)}>
      <div className={css(style.main)}>
        <h1 className={css(style.title)}>
          {title}
        </h1>
        <div className={css(style.description)}>
          {description}
        </div>
      </div>
      <div className={css(style.sub)}>
        {children}
      </div>
    </header>
  )
}

module.exports = Header
