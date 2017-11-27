const React = require('react')
const get = require('lodash/get')
const { Helmet } = require('react-helmet')

const { Table } = require('@nudj/components')
const getStyle = require('./style.css')
const Page = require('../../components/page')
const { Link } = require('react-router-dom')
const PageHeader = require('../../components/page-header')

const surveyPage = (props) => {
  const surveys = get(props, 'surveys', [])
  const query = get(props, 'location.search', '')
  const style = getStyle()

  const columns = [
    { heading: 'Company', name: 'company.name' },
    { heading: 'Intro Title', name: 'title' },
    { heading: 'Description', name: 'description' },
    { name: 'link' }
  ]

  const cellRenderer = (column, row, defaultRender) => {
    if (column.name === 'link') {
      return <Link className={style.link} to={`/surveys/${row.id}`}>View/Edit</Link>
    }
    return defaultRender
  }

  return (
    <Page {...props} className={style.pageBody}>
      <Helmet>
        <title>ADMIN - Surveys</title>
      </Helmet>
      <PageHeader title='Surveys'>
        <a className={style.link} href={`/surveys/new${query}`}>New Survey</a>
      </PageHeader>
      <h3 className={style.pageHeadline}>Surveys <span className={style.textHighlight}>({surveys.length})</span></h3>
      <div className={style.pageContent}>
        <div className={style.pageMain}>
          <Table cellRenderer={cellRenderer} data={surveys} columns={columns} />
        </div>
      </div>
    </Page>
  )
}

module.exports = surveyPage
