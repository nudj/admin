// @flow
const React = require('react')
const get = require('lodash/get')
const filter = require('lodash/filter')
const { Helmet } = require('react-helmet')
const { parse } = require('query-string')

const { Table } = require('@nudj/components')
const getStyle = require('./style.css')
const Page = require('../../components/page')
const { Link } = require('react-router-dom')
const PageHeader = require('../../components/page-header')

type Draft = {
  intro?: string,
  outro?: string,
  introDescription?: string,
  outroDescription?: string,
  slug?: string
}

type PageProps = {
  draft?: Draft
}

type Company = {
  id: string,
  name: string
}

type Surveys = {
  intro?: string,
  outro?: string,
  introDescription?: string,
  outroDescription?: string,
  slug?: string,
  company?: Company
}

type SurveyPageProps = {
  surveys: Array<Surveys>,
  surveyPage: PageProps,
}

const createFilter = (filter) => {
  const query = parse(filter)

  let filters = query
  if (query.company) {
    filters.company = { id: query.company }
  }
  return filters
}

const surveyPage = (props: SurveyPageProps) => {
  const surveys = get(props, 'surveys', [])
  const query = get(props, 'location.search', '')
  const data = filter(surveys, createFilter(query))
  const style: Object = getStyle()

  const columns = [
    { heading: 'Company', name: 'company.name' },
    { heading: 'Intro Title', name: 'introTitle' },
    { heading: 'Description', name: 'introDescription' },
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
        <Link className={style.link} to={`/surveys/new${query}`}>New Survey</Link>
      </PageHeader>
      <h3 className={style.pageHeadline}>Surveys <span className={style.textHighlight}>({data.length})</span></h3>
      <div className={style.pageContent}>
        <div className={style.pageMain}>
          <Table cellRenderer={cellRenderer} data={data} columns={columns} />
        </div>
      </div>
    </Page>
  )
}

module.exports = surveyPage
