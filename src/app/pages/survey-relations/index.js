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
const PropTypes = require('../../lib/prop-types')
const { setListOrder, saveListOrder } = require('./actions')

const SurveyRelationsPage = props => {
  const {
    survey,
    survey: { sections, company },
    surveyRelationsPage: { order: newOrder }
  } = props

  const data = sections.map((section, order) => merge(section, { order }))

  const columns = [
    { heading: 'Title', name: 'title' },
    { heading: 'Description', name: 'description' },
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
      return <Link className={css(style.link)} to={`/survey-sections/${row.id}`}>View/Edit</Link>
    }
    if (column.name === 'order') {
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

  let pageHeadline
  if (company) {
    pageHeadline = (
      <h3 className={css(style.pageHeadline)}>
        <span className={css(style.textHighlight)}>{company.name}</span> - {survey.introTitle}
      </h3>
    )
  } else {
    pageHeadline = (
      <h3 className={css(style.pageHeadline)}>
        {survey.introTitle}
      </h3>
    )
  }

  return (
    <Page
      {...props}
      title='Surveys'
      actions={[
        <Link
          key='survey'
          className={css(style.link)}
          to={`/surveys/${survey.id}`}
        >
          Survey
        </Link>
      ]}
    >
      <Helmet>
        <title>ADMIN - Surveys</title>
      </Helmet>
      {pageHeadline}
      <h3 className={css(style.pageHeadline)}>Sections <span className={css(style.textHighlight)}>({sections.length})</span></h3>
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
          <Link
            className={css(style.addButton)}
            to={`/survey-sections/new?survey=${survey.id}`}
          >
            Add Section
          </Link>
        </div>
      </div>
    </Page>
  )
}

SurveyRelationsPage.propTypes = {
  survey: PropTypes.shape({
    id: PropTypes.id,
    introTitle: PropTypes.string,
    sections: PropTypes.arrayOf(PropTypes.SurveySection),
    company: PropTypes.Company
  }),
  surveyRelationsPage: PropTypes.shape({
    order: PropTypes.object
  }),
  dispatch: PropTypes.function
}

SurveyRelationsPage.defaultProps = {
  survey: {
    sections: [],
    company: null,
    surveyRelationsPage: {
      order: {}
    }
  }
}

module.exports = SurveyRelationsPage
