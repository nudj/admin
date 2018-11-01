const React = require('react')
const get = require('lodash/get')
const { Helmet } = require('react-helmet')
const { Link: RRLink } = require('react-router-dom')

const { css, mss } = require('@nudj/components/styles')
const { Table, Link } = require('@nudj/components')
const style = require('./style.css')
const Page = require('../../components/page')
const Breadcrumb = require('../../components/breadcrumb')
const PropTypes = require('../../lib/prop-types')

const SurveyQuestionsPage = props => {
  const { survey, questions } = props
  const data = questions || get(survey, 'questions', [])
  const query = survey ? `?survey=${get(survey, 'id', '')}` : ''

  const columns = [
    { heading: 'Title', name: 'title' },
    { heading: 'Name', name: 'name' },
    { heading: 'Description', name: 'description' },
    { heading: 'Type', name: 'type' },
    { name: 'link' }
  ]

  const cellRenderer = (column, row, defaultRender) => {
    if (column.name === 'link') {
      return (
        <RRLink className={css(style.link)} to={`/survey-questions/${row.id}`}>
          View/Edit
        </RRLink>
      )
    }
    return defaultRender
  }

  return (
    <Page
      {...props}
      title='Questions'
      actions={(
        <RRLink
          className={css(style.link)}
          to={`/survey-questions/new${query}`}
        >
          New Question
        </RRLink>
      )}
    >
      <Helmet>
        <title>ADMIN - Questions</title>
      </Helmet>
      {survey && (
        <Breadcrumb>
          <Link subtle inline volume='yell' href='/surveys'>
            All Surveys
          </Link>
          <Link subtle inline volume='yell' href={`/surveys/${survey.id}`}>
            Survey
          </Link>
          <span style={mss.bold}>Questions</span>
        </Breadcrumb>
      )}
      <h3 className={css(style.pageHeadline)}>
        Questions <span className={css(style.textHighlight)}>({data.length})</span>
      </h3>
      <div className={css(style.pageContent)}>
        <div className={css(style.pageMain)}>
          <Table cellRenderer={cellRenderer} data={data} columns={columns} />
        </div>
      </div>
    </Page>
  )
}

SurveyQuestionsPage.propTypes = {
  questions: PropTypes.arrayOf(PropTypes.SurveyQuestion)
}

module.exports = SurveyQuestionsPage
