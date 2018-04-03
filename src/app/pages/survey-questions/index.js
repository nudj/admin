/* global SurveyQuestion */
// @flow
const React = require('react')
const get = require('lodash/get')
const { Helmet } = require('react-helmet')

const { css } = require('@nudj/components/lib/css')
const { Table } = require('@nudj/components')
const style = require('./style.css')
const Page = require('../../components/page')
const { Link } = require('react-router-dom')

type SurveyQuestionPageType = {
  questions?: Array<SurveyQuestion>,
  section: {
    questions: Array<SurveyQuestion>
  }
}

const SurveyQuestionsPage = (props: SurveyQuestionPageType) => {
  const { questions, section } = props
  const data = questions || section.questions
  const query = section ? `?survey=${get(section, 'id', '')}` : ''

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
        <Link className={css(style.link)} to={`/survey-questions/${row.id}`}>
          View/Edit
        </Link>
      )
    }
    return defaultRender
  }

  return (
    <Page
      {...props}
      title='Questions'
      actions={(
        <Link
          className={css(style.link)}
          to={`/survey-questions/new${query}`}
        >
          New Question
        </Link>
      )}
    >
      <Helmet>
        <title>ADMIN - Questions</title>
      </Helmet>
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

module.exports = SurveyQuestionsPage
