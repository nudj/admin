const React = require('react')
const get = require('lodash/get')
const { Helmet } = require('react-helmet')

const { Table } = require('@nudj/components')
const getStyle = require('./style.css')
const Page = require('../../components/page')
const { Link } = require('react-router-dom')
const PageHeader = require('../../components/page-header')

const SurveyQuestionsPage = (props) => {
  const { questions, section } = props
  const data = questions || section.questions
  const query = section ? `?survey=${get(section, 'id', '')}` : ''
  const style = getStyle()

  const columns = [
    { heading: 'Title', name: 'title' },
    { heading: 'Name', name: 'name' },
    { heading: 'Description', name: 'description' },
    { heading: 'Type', name: 'type' },
    { name: 'link' }
  ]

  const cellRenderer = (column, row, defaultRender) => {
    if (column.name === 'link') {
      return <Link className={style.link} to={`/survey-question/${row.id}`}>View/Edit</Link>
    }
    return defaultRender
  }

  return (
    <Page {...props} className={style.pageBody}>
      <Helmet>
        <title>ADMIN - Questions</title>
      </Helmet>
      <PageHeader title='Questions'>
        <Link className={style.link} to={`/survey-question/new${query}`}>New Question</Link>
      </PageHeader>
      <h3 className={style.pageHeadline}>Questions <span className={style.textHighlight}>({data.length})</span></h3>
      <div className={style.pageContent}>
        <div className={style.pageMain}>
          <Table cellRenderer={cellRenderer} data={data} columns={columns} />
        </div>
      </div>
    </Page>
  )
}

module.exports = SurveyQuestionsPage
