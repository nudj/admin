const React = require('react')
const { Helmet } = require('react-helmet')
const { Link: RRLink } = require('react-router-dom')
const isNil = require('lodash/isNil')
const isEmpty = require('lodash/isEmpty')

const { Table, Input, Button, Link } = require('@nudj/components')
const { css, mss } = require('@nudj/components/styles')
const { merge } = require('@nudj/library')
const style = require('./style.css')
const Page = require('../../components/page')
const Breadcrumb = require('../../components/breadcrumb')
const { setListOrder, saveListOrder } = require('./actions')
const PropTypes = require('../../lib/prop-types')

const SurveyRelatedQuestionsPage = props => {
  const {
    survey,
    survey: { questions },
    surveyRelatedQuestionsPage: { order: newOrder }
  } = props

  const data = questions.map((question, order) => merge(question, { order }))

  const columns = [
    { heading: 'Title', name: 'title' },
    { heading: 'Description', name: 'introDescription' },
    { heading: 'Type', name: 'type' },
    { heading: 'List order', name: 'order' },
    { name: 'link' }
  ]

  const onChange = (event) => props.dispatch(setListOrder({
    [event.name]: event.value
  }))

  const onSubmit = (event) => {
    event.preventDefault()
    props.dispatch(saveListOrder())
  }

  const cellRenderer = (column, row, defaultRender) => {
    if (column.name === 'link') {
      return <RRLink className={css(style.link)} to={`/surveys/${survey.id}/questions/${row.id}`}>View/Edit</RRLink>
    } else if (column.name === 'order') {
      const order = newOrder[row.id]
      return (
        <Input
          type='text'
          name={row.id}
          value={isNil(order) ? row.order + 1 : order} onChange={onChange}
        />
      )
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
      <Breadcrumb>
        <Link subtle inline volume='yell' href='/surveys'>
          All Surveys
        </Link>
        <Link subtle inline volume='yell' href={`/surveys/${survey.id}`}>
          Survey
        </Link>
        <span style={mss.bold}>Questions</span>
      </Breadcrumb>
      <h3 className={css(style.pageHeadline)}>{survey.title}</h3>
      <h3 className={css(style.pageHeadline)}>Questions <span className={css(style.textHighlight)}>({questions.length})</span></h3>
      <div className={css(style.pageContent)}>
        <div className={css(style.pageMain)}>
          <form onSubmit={onSubmit}>
            <Table cellRenderer={cellRenderer} data={data} columns={columns} />
            { !isEmpty(newOrder) && (
              <Button volume='yell' type='submit'>
                Reorder questions
              </Button>
            ) }
          </form>
          <RRLink
            className={css(style.addButton)}
            to={`/surveys/${survey.id}/questions/new`}
          >
            Add Question
          </RRLink>
        </div>
      </div>
    </Page>
  )
}

SurveyRelatedQuestionsPage.propTypes = {
  dispatch: PropTypes.function,
  surveyRelatedQuestionsPage: PropTypes.shape({
    order: PropTypes.object
  })
}

SurveyRelatedQuestionsPage.defaultProps = {
  survey: {
    questions: []
  },
  surveyRelatedQuestionsPage: {
    order: {}
  }
}

module.exports = SurveyRelatedQuestionsPage
