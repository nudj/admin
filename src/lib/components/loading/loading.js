const React = require('react')
const getStyle = require('./loading.css')
const PageHeader = require('../page-header/page-header')

const Loading = () => {
  const style = getStyle()
  return <div className={style.loading}>
    <PageHeader />
    <div className={style.body}>
      <div className={style.spinner} />
    </div>
  </div>
}

module.exports = Loading
