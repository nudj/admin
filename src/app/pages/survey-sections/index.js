const React = require('react')
const get = require('lodash/get')
const omit = require('lodash/omit')
const filter = require('lodash/filter')
const { Helmet } = require('react-helmet')
const { parse } = require('query-string')

const { Table } = require('@nudj/components')
const { merge } = require('@nudj/library')
const getStyle = require('./style.css')
const Page = require('../../components/page')
const { Link } = require('react-router-dom')
const PageHeader = require('../../components/page-header')

const createFilter = (filter) => {
  const query = parse(filter)

  let filters = query
  if (query.survey) {
    filters.survey = { id: query.survey }
  }

  if (query.company) {
    const cleanFilter = omit(filters, ['company'])
    filters = merge(cleanFilter, { survey: { company: { id: query.company } } })
  }
  return filters
}

const SurveySectionsPage = (props) => {
  const { sections, location } = props
  const query = get(location, 'search', '')
  const data = filter(sections, createFilter(query))
  const style = getStyle()

  const columns = [
    { heading: 'Title', name: 'title' },
    { heading: 'Description', name: 'description' },
    { heading: 'Company', name: 'survey.company.name' },
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
        <title>ADMIN - Sections</title>
      </Helmet>
      <PageHeader title='Sections'>
        <Link className={style.link} to={`/survey-section/new${query}`}>New Section</Link>
      </PageHeader>
      <h3 className={style.pageHeadline}>Sections <span className={style.textHighlight}>({data.length})</span></h3>
      <div className={style.pageContent}>
        <div className={style.pageMain}>
          <Table cellRenderer={cellRenderer} data={data} columns={columns} />
        </div>
      </div>
    </Page>
  )
}

SurveySectionsPage.defaultProps = {
  sections: [],
  location: {}
}

module.exports = SurveySectionsPage
