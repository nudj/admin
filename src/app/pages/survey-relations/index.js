const React = require('react')
const { Helmet } = require('react-helmet')
const isNil = require('lodash/isNil')
const isEmpty = require('lodash/isEmpty')

const { Table, Input, Button } = require('@nudj/components')
const { merge } = require('@nudj/library')
const getStyle = require('./style.css')
const Page = require('../../components/page')
const { Link } = require('react-router-dom')
const PageHeader = require('../../components/page-header')
const { setListOrder, saveListOrder } = require('./actions')

const SurveyRelationsPage = (props) => {
  const {
    survey,
    survey: { sections, company },
    surveyRelationsPage: { order: newOrder }
  } = props

  const data = sections.map((section, order) => merge(section, { order }))
  const style = getStyle()

  const columns = [
    { heading: 'Title', name: 'title' },
    { heading: 'Description', name: 'description' },
    { heading: 'List order', name: 'order' },
    { name: 'link' }
  ]

  const onChange = (event) => props.dispatch(setListOrder({
    [event.name]: event.value
  }))

  const onSubmit = () => props.dispatch(saveListOrder())

  const cellRenderer = (column, row, defaultRender) => {
    if (column.name === 'link') {
      return <Link className={style.link} to={`/survey-section/${row.id}`}>View/Edit</Link>
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

  return (
    <Page {...props} className={style.pageBody}>
      <Helmet>
        <title>ADMIN - Surveys</title>
      </Helmet>
      <PageHeader title='Surveys'>
        <Link className={style.link} to={`/survey-section/new?survey=${survey.id}`}>Add Section</Link>
        <Link className={style.link} to={`/survey/${survey.id}`}>Edit Survey</Link>
        <Link className={style.link} to={`/survey/new?company=${company.id}`}>New Survey</Link>
      </PageHeader>
      <h3 className={style.pageHeadline}>
        <span className={style.textHighlight}>{company.name}</span> - {survey.introTitle}
      </h3>
      <h3 className={style.pageHeadline}>Sections <span className={style.textHighlight}>({sections.length})</span></h3>
      <div className={style.pageContent}>
        <div className={style.pageMain}>
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

SurveyRelationsPage.defaultProps = {
  survey: {
    sections: [],
    company: {},
    surveyRelationsPage: {
      order: {}
    }
  }
}

module.exports = SurveyRelationsPage
