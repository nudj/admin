/* global Dispatch SurveyQuestion ID */
// @flow
const React = require('react')
const { Helmet } = require('react-helmet')
const { Link } = require('react-router-dom')
const isNil = require('lodash/isNil')
const isEmpty = require('lodash/isEmpty')

const { Table, Input, Button } = require('@nudj/components')
const { css } = require('@nudj/components/lib/css')
const { merge } = require('@nudj/library')
const style = require('./style.css')
const Page = require('../../components/page')
const PageHeader = require('../../components/page-header')
const { setListOrder, saveListOrder } = require('./actions')

type SectionRelationsProps = {
  dispatch: Dispatch,
  section: {
    id: ID,
    title: string,
    questions: Array<SurveyQuestion>,
    survey: {
      id: ID,
    }
  },
  surveySectionRelationsPage: {
    order: Object
  }
}

const SurveySectionRelationsPage = (props: SectionRelationsProps) => {
  const {
    section,
    section: { questions },
    surveySectionRelationsPage: { order: newOrder }
  } = props

  const data = questions.map((section, order) => merge(section, { order }))

  const columns = [
    { heading: 'Title', name: 'title' },
    { heading: 'Description', name: 'description' },
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
      return <Link className={css(style.link)} to={`/survey-question/${row.id}`}>View/Edit</Link>
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
    <Page {...props} className={css(style.pageBody)}>
      <Helmet>
        <title>ADMIN - Surveys</title>
      </Helmet>
      <PageHeader title='Surveys'>
        <Link className={css(style.link)} to={`/survey-question/new?section=${section.id}`}>Add Question</Link>
        <Link className={css(style.link)} to={`/survey-section/new?survey=${section.survey.id}`}>Add Section</Link>
        <Link className={css(style.link)} to={`/survey/${section.id}`}>Edit Survey</Link>
      </PageHeader>
      <h3 className={css(style.pageHeadline)}>{section.title}</h3>
      <h3 className={css(style.pageHeadline)}>Questions <span className={css(style.textHighlight)}>({questions.length})</span></h3>
      <div className={css(style.pageContent)}>
        <div className={css(style.pageMain)}>
          <form onSubmit={onSubmit}>
            <Table cellRenderer={cellRenderer} data={data} columns={columns} />
            { !isEmpty(newOrder) && (
              <Button volume='yell' type='submit'>
                Reorder sections
              </Button>
            ) }
          </form>
        </div>
      </div>
    </Page>
  )
}

SurveySectionRelationsPage.defaultProps = {
  section: {
    questions: [],
    surveySectionRelationsPage: {
      order: {}
    }
  }
}

module.exports = SurveySectionRelationsPage
