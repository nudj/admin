const React = require('react')
const get = require('lodash/get')
const { Helmet } = require('react-helmet')

const { Table } = require('@nudj/components')

const getStyle = require('./style.css')
const Page = require('../../components/page')
const { Link } = require('react-router-dom')
const PageHeader = require('../../components/page-header')

const SurveyPage = (props) => {
  const surveys = get(props, 'surveys', [])
  const style = getStyle()

  const columns = [
    { heading: 'Company', name: 'company' },
    { heading: 'Intro Title', name: 'name' },
    { heading: 'Description', name: 'description' },
    { name: 'link' }
  ]

  const data = surveys.map(survey => (
    {
      id: survey.id,
      name: survey.title,
      description: survey.description,
      company: survey.company.name
    }
  ))

  const cellRenderer = (column, row, defaultRender) => {
    if (column.name === 'link') {
      return <Link className={style.link} to={`/sections/${row.id}`}>View/Edit</Link>
    }
    return defaultRender
  }

  return (
    <Page {...props} className={style.pageBody}>
      <Helmet>
        <title>ADMIN - Surveys</title>
      </Helmet>
      <PageHeader title='Surveys' />
      <h3 className={style.pageHeadline}>Surveys <span className={style.textHighlight}>({surveys.length})</span></h3>
      <div className={style.pageContent}>
        <div className={style.pageMain}>
          <Table cellRenderer={cellRenderer} data={data} columns={columns} />
        </div>
      </div>
    </Page>
  )
}

module.exports = SurveyPage
