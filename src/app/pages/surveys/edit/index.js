// @flow
const React = require('react')
const get = require('lodash/get')
const { Helmet } = require('react-helmet')
const { Link } = require('react-router-dom')

const { Input, InputField, Card, Table } = require('@nudj/components')
const actions = require('@nudj/framework/actions')
const { merge } = require('@nudj/library')

const { setSurveyDraft } = require('../actions')
const getStyle = require('./style.css')
const Page = require('../../../components/page')
const PageHeader = require('../../../components/page-header')

type Company = {
  name: string,
  id: string
}

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

type Survey = {
  id: string | number,
  introTitle?: string,
  outroTitle?: string,
  introDescription?: string,
  outroDescription?: string,
  slug?: string,
  company?: Company
}

type EditSurveyPageProps = {
  dispatch: Function,
  companies?: Array<Company>,
  survey: Survey,
  surveyPage: PageProps
}

const EditSurveyPage = (props: EditSurveyPageProps) => {
  const { survey } = props
  const sections = get(survey, 'sections', [])
  const company = get(survey, 'company', {})
  const style: Object = getStyle()
  const fieldStyles = { root: style.field }

  const onChange = (event) => {
    const target = event.target || event
    const survey = get(props, 'surveyPage.draft', {})
    const draft = merge(survey, { [target.name]: target.value })
    props.dispatch(setSurveyDraft(draft))
  }

  const cellRenderer = (column, row, defaultRender) => {
    if (column.name === 'link') {
      return <Link className={style.link} to={`/sections/${row.id}`}>View/Edit</Link>
    }
    return defaultRender
  }

  const columns = [
    { heading: 'Title', name: 'title' },
    { heading: 'Description', name: 'description' },
    { name: 'link' }
  ]

  const onSubmit = (event) => {
    event.preventDefault()
    const data = get(props, 'surveyPage.draft', {})
    const url = `/surveys/${survey.id}`
    const method = 'patch'
    return props.dispatch(actions.app.postData({ url, data, method }, () => {
      props.dispatch(actions.app.showNotification({
        type: 'success',
        message: 'Survey updated'
      }))
    }))
  }

  return (
    <Page {...props} className={style.pageBody}>
      <Helmet>
        <title>ADMIN - Surveys</title>
      </Helmet>
      <PageHeader title='Surveys'>
        <Link className={style.link} to={`/surveys?company=${company.id}`}>Company Surveys</Link>
      </PageHeader>
      <h3 className={style.pageHeadline}>Survey for <span className={style.textHighlight}>{company.name}</span></h3>
      <div className={style.pageContent}>
        <div className={style.pageMain}>
          <form className={style.pageMain} onSubmit={onSubmit}>
            <Card>
              <InputField classNames={fieldStyles} label='Intro Title' htmlFor='intro-title'>
                <Input
                  type='text'
                  id='intro-title'
                  name='introTitle'
                  value={get(props, 'surveyPage.draft.introTitle', survey.introTitle)}
                  onChange={onChange}
                />
              </InputField>
              <InputField classNames={fieldStyles} label='Slug' htmlFor='slug'>
                <Input
                  type='textarea'
                  id='slug'
                  name='slug'
                  value={get(props, 'surveyPage.draft.slug', survey.slug)}
                  onChange={onChange}
                />
              </InputField>
              <InputField classNames={fieldStyles} label='Intro Description' htmlFor='intro-description'>
                <Input
                  type='textarea'
                  id='intro-description'
                  name='introDescription'
                  value={get(props, 'surveyPage.draft.introDescription', survey.introDescription)}
                  onChange={onChange}
                />
              </InputField>
              <InputField classNames={fieldStyles} label='Outro Title' htmlFor='outro-title'>
                <Input
                  type='text'
                  id='outro-title'
                  name='outroTitle'
                  value={get(props, 'surveyPage.draft.outroTitle', survey.outroTitle)}
                  onChange={onChange}
                />
              </InputField>
              <InputField classNames={fieldStyles} label='Outro Description' htmlFor='outro-description'>
                <Input
                  type='textarea'
                  id='outro-description'
                  name='outroDescription'
                  value={get(props, 'surveyPage.draft.outroDescription', survey.outroDescription)}
                  onChange={onChange}
                />
              </InputField>
            </Card>
            <div className={style.formButtons}>
              <button className={style.submitButton}>SUBMIT</button>
            </div>
          </form>
          <h3 className={style.pageHeadline}>Sections <span className={style.textHighlight}>({sections.length})</span></h3>
          <Table cellRenderer={cellRenderer} data={sections} columns={columns} />
        </div>
      </div>
    </Page>
  )
}

module.exports = EditSurveyPage
