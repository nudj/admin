const React = require('react')
const get = require('lodash/get')
const filter = require('lodash/filter')
const findIndex = require('lodash/findIndex')
const { Helmet } = require('react-helmet')
const { parse } = require('query-string')
const { Link } = require('react-router-dom')
const { Table } = require('@nudj/components')
const { css } = require('@nudj/components/lib/css')

const PropTypes = require('../../lib/prop-types')
const style = require('./style.css')
const Page = require('../../components/page')
const { DEFAULT_SURVEY_SLUG } = require('../../lib/constants')

function ensureDefaultIsFirst (surveys) {
  const indexOfDefault = findIndex(surveys, { slug: DEFAULT_SURVEY_SLUG })
  if (indexOfDefault > 0) {
    surveys = [
      surveys[indexOfDefault],
      ...surveys.slice(0, indexOfDefault),
      ...surveys.slice(indexOfDefault + 1)
    ]
  }
  return surveys
}

const createFilter = (filter) => {
  const query = parse(filter)

  let filters = query
  if (query.company) {
    filters.company = { id: query.company }
  }
  return filters
}

const SurveysPage = props => {
  const { surveys: unsortedSurveys, location } = props
  const surveys = ensureDefaultIsFirst(unsortedSurveys)
  const query = get(location, 'search', '')
  const data = filter(surveys, createFilter(query))

  const columns = [
    { heading: 'Company', name: 'company.name' },
    { heading: 'Slug', name: 'slug' },
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
    <Page
      {...props}
      title='Surveys'
    >
      <Helmet>
        <title>ADMIN - Surveys</title>
      </Helmet>
      <h3 className={css(style.pageHeadline)}>Surveys <span className={css(style.textHighlight)}>({data.length})</span></h3>
      <div className={css(style.pageContent)}>
        <div className={css(style.pageMain)}>
          <Table cellRenderer={cellRenderer} data={data} columns={columns} />
          <Link
            className={css(style.addButton)}
            to={`/surveys/new${query}`}
          >
            New Survey
          </Link>
        </div>
      </div>
    </Page>
  )
}

SurveysPage.propTypes = {
  surveys: PropTypes.arrayOf(PropTypes.Survey),
  location: PropTypes.Location,
  surveyPage: PropTypes.shape({
    draft: PropTypes.Draft
  })
}

SurveysPage.defaultProps = {
  surveys: [],
  location: {}
}

module.exports = SurveysPage
