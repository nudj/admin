const React = require('react')
const { Helmet } = require('react-helmet')

const { Table } = require('@nudj/components')
const getStyle = require('./style.css')
const Page = require('../../components/page')
const { Link } = require('react-router-dom')
const PageHeader = require('../../components/page-header')

const SurveyRelationsPage = (props) => {
  const { survey } = props
  const { sections, company } = survey

  const style = getStyle()

  const columns = [
    { heading: 'Title', name: 'title' },
    { heading: 'Description', name: 'description' },
    { name: 'link' }
  ]

  const cellRenderer = (column, row, defaultRender) => {
    if (column.name === 'link') {
      return <Link className={style.link} to={`/survey-section/${row.id}`}>View/Edit</Link>
    }
    return defaultRender
  }

  return (
    <Page {...props} className={style.pageBody}>
      <Helmet>
        <title>ADMIN - Surveys</title>
      </Helmet>
      <PageHeader title='Surveys'>
        <Link className={style.link} to={`/survey-section/new?survey=${survey.id}`}>Add Section</Link>
        <Link className={style.link} to={`/survey/${survey.id}`}>Edit Survey</Link>
        <Link className={style.link} to={`/survey/new?company=${company.id}`}>New Survey</Link>
      </PageHeader>
      <h3 className={style.pageHeadline}>
        <span className={style.textHighlight}>{company.name}</span> - {survey.introTitle}
      </h3>
      <h3 className={style.pageHeadline}>Sections <span className={style.textHighlight}>({sections.length})</span></h3>
      <div className={style.pageContent}>
        <div className={style.pageMain}>
          <Table cellRenderer={cellRenderer} data={sections} columns={columns} />
        </div>
      </div>
    </Page>
  )
}

module.exports = SurveyRelationsPage
