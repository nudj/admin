/* global SurveySection */
// @flow
const React = require('react')
const get = require('lodash/get')
const { Helmet } = require('react-helmet')

const { Table } = require('@nudj/components')
const { css } = require('@nudj/components/lib/css')
const style = require('./style.css')
const Page = require('../../components/page')
const { Link } = require('react-router-dom')
const PageHeader = require('../../components/page-header')

type SurveySectionsPageProps = {
  survey: {
    sections: Array<SurveySection>
  },
  sections: Array<SurveySection>
}

const SurveySectionsPage = (props: SurveySectionsPageProps) => {
  const { sections, survey } = props
  const data = sections || survey.sections
  const query = survey ? `?survey=${get(survey, 'id', '')}` : ''

  const columns = [
    { heading: 'Title', name: 'title' },
    { heading: 'Description', name: 'description' },
    { heading: 'Company', name: 'survey.company.name' },
    { name: 'link' }
  ]

  const cellRenderer = (column, row, defaultRender) => {
    if (column.name === 'link') {
      return <Link className={css(style.link)} to={`/survey-section/${row.id}`}>View/Edit</Link>
    }
    return defaultRender
  }

  return (
    <Page {...props} className={css(style.pageBody)}>
      <Helmet>
        <title>ADMIN - Sections</title>
      </Helmet>
      <PageHeader title='Sections'>
        <Link className={css(style.link)} to={`/survey-section/new${query}`}>New Section</Link>
      </PageHeader>
      <h3 className={css(style.pageHeadline)}>Sections <span className={css(style.textHighlight)}>({data.length})</span></h3>
      <div className={css(style.pageContent)}>
        <div className={css(style.pageMain)}>
          <Table cellRenderer={cellRenderer} data={data} columns={columns} />
        </div>
      </div>
    </Page>
  )
}

module.exports = SurveySectionsPage
