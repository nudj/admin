const React = require('react')
const get = require('lodash/get')
const { Helmet } = require('react-helmet')

const { Table } = require('@nudj/components')

const getStyle = require('./style.css')
const Page = require('../page')
const { Link } = require('react-router-dom')
const PageHeader = require('../page-header')

const DataPage = (props) => {
  const columns = get(props, 'columns', [])
  const data = get(props, 'data', [])
  const title = get(props, 'title', '')
  const style = getStyle()

  const cellRenderer = (column, row, defaultRender) => {
    if (column.name === 'link') {
      return <Link className={style.link} to={`/sections/${row.id}`}>View/Edit</Link>
    }
    return defaultRender
  }

  return (
    <Page {...props} className={style.pageBody}>
      <Helmet>
        <title>ADMIN - {title}</title>
      </Helmet>
      <PageHeader title={title} />
      <h3 className={style.pageHeadline}>{title} <span className={style.textHighlight}>({data.length})</span></h3>
      <div className={style.pageContent}>
        <div className={style.pageMain}>
          <Table
            cellRenderer={cellRenderer}
            data={data}
            columns={columns}
            classNames={{ root: style.root, row: style.row }}
          />
        </div>
      </div>
    </Page>
  )
}

module.exports = DataPage
