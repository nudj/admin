/* global Draft Survey Location */
// @flow
const React = require('react')
const get = require('lodash/get')
const filter = require('lodash/filter')
const { Helmet } = require('react-helmet')
const { parse } = require('query-string')

const { Table } = require('@nudj/components')
const { css } = require('@nudj/components/lib/css')
const style = require('./style.css')
const Page = require('../../components/page')
const { Link } = require('react-router-dom')
const PageHeader = require('../../components/page-header')

type SurveyPageProps = {
  surveys: Array<Survey>,
  location: Location,
  surveyPage: {
    draft?: Draft
  }
}

const createFilter = (filter) => {
  const query = parse(filter)

  let filters = query
  if (query.company) {
    filters.company = { id: query.company }
  }
  return filters
}

const SurveysPage = (props: SurveyPageProps) => {
  const { surveys, location } = props
  const query = get(location, 'search', '')
  const data = filter(surveys, createFilter(query))

  const columns = [
    { heading: 'Company', name: 'company.name' },
    { heading: 'Intro Title', name: 'introTitle' },
    { heading: 'Description', name: 'introDescription' },
    { name: 'link' }
  ]

  const cellRenderer = (column, row, defaultRender) => {
    if (column.name === 'link') {
      return <Link className={css(style.link)} to={`/surveys/${row.id}`}>View/Edit</Link>
    }
    return defaultRender
  }

  return (
    <Page {...props} className={css(style.pageBody)}>
      <Helmet>
        <title>ADMIN - Surveys</title>
      </Helmet>
      <PageHeader title='Surveys'>
        <Link className={css(style.link)} to={`/surveys/new${query}`}>New Survey</Link>
      </PageHeader>
      <h3 className={css(style.pageHeadline)}>Surveys <span className={css(style.textHighlight)}>({data.length})</span></h3>
      <div className={css(style.pageContent)}>
        <div className={css(style.pageMain)}>
          <Table cellRenderer={cellRenderer} data={data} columns={columns} />
        </div>
      </div>
    </Page>
  )
}

SurveysPage.defaultProps = {
  surveys: [],
  location: {}
}

module.exports = SurveysPage
