const React = require('react')
const get = require('lodash/get')
const getStyle = require('./row-item.css')

const RowItem = (props) => {
  const style = getStyle()

  const rowClass = props.rowClass || 'row'

  return (
    <li className={style[rowClass]}>
      <a className={style.title} href={get(props, 'uri')}>{get(props, 'title')}</a>
      <ul className={style.details}>
        {get(props, 'details', []).map((detail) => {
          return (
            <li key={get(detail, 'term')} className={style.detail}>
              <dl className={style.definition}>
                <dt className={style.definitionTerm}>{get(detail, 'term')}</dt>
                <dd className={style.definitionDescription}>{get(detail, 'description')}</dd>
              </dl>
            </li>
          )
        })}
      </ul>
      <ul className={style.actions}>
        {get(props, 'actions', []).map((action, index) => {
          return (
            <li key={index} className={style.action}>
              {action}
            </li>
          )
        })}
      </ul>
    </li>
  )
}

module.exports = RowItem
