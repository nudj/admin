// @flow
const React = require('react')
const get = require('lodash/get')
const find = require('lodash/find')
const { parse } = require('query-string')
const { Helmet } = require('react-helmet')

const { Input, InputField, Card } = require('@nudj/components')
const actions = require('@nudj/framework/actions')
const { merge } = require('@nudj/library')

const { setSurveyDraft } = require('../actions')
const getStyle = require('./style.css')
const Page = require('../../../components/page')
const { Link } = require('react-router-dom')
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

type Surveys = {
  intro?: string,
  outro?: string,
  introDescription?: string,
  outroDescription?: string,
  slug?: string,
  company?: Company
}

type NewSurveyPageProps = {
  dispatch: Function,
  companies?: Array<Company>,
  surveys: Array<Surveys>,
  surveyPage: PageProps
}

const NewSurveyPage = (props: NewSurveyPageProps) => {
  const query = parse(get(props, 'location.search', ''))
  const companies = get(props, 'companies', [])
  const surveys = get(props, 'surveys', [])
  const company = find(companies, { id: query.company }) || {}
  const style: Object = getStyle()
  const fieldStyles = { root: style.field }

  const onChange = (event) => {
    const target = event.target || event
    const survey = get(props, 'surveyPage.draft', {})
    const draft = merge(survey, { [target.name]: target.value })
    props.dispatch(setSurveyDraft(draft))
  }

  const makeSlugFromTitle = (title) => {
    return title.toLowerCase()
      .replace(/\s+/g, ' ')
      .replace(/\s/g, '-')
      .replace(/[^a-z0-9-]/g, '')
  }

  const onChangeTitle = (event) => {
    const title = event.value
    const slug = makeSlugFromTitle(title)
    const survey = get(props, 'surveyPage.draft', {})
    const draft = merge(survey, { [event.name]: title, slug })
    props.dispatch(setSurveyDraft(draft))
  }

  const validateSlug = () => {
    const draftSlug = get(props, 'surveyPage.draft.slug', '')
    const slugs = surveys.map(survey => survey.slug)
    return slugs.includes(draftSlug) ? 'This slug already exists' : ''
  }

  const renderCompaniesList = () => (
    <select className={style.selectBox} id='company' name='company' onChange={onChange}>
      <option>Choose a company</option>
      {
        companies.map((company, index) => (
          <option key={index} value={company.id}>{company.name}</option>
        ))
      }
    </select>
  )

  const onSubmit = (event) => {
    event.preventDefault()
    const draft = get(props, 'surveyPage.draft', {})
    const data = company.id ? merge(draft, { company: company.id }) : draft
    const validCompany = !!find(companies, { id: data.company })

    if (!validCompany) {
      const notification = { type: 'error', message: 'Please choose a company' }
      return props.dispatch(actions.app.showNotification(notification))
    }

    const slugs = surveys.map(survey => survey.slug)
    if (slugs.includes(data.slug)) {
      const notification = { type: 'error', message: 'Invalid slug' }
      return props.dispatch(actions.app.showNotification(notification))
    }

    const url = `/surveys`
    const method = 'post'
    return props.dispatch(actions.app.postData({ url, data, method }, (postedData) => {
      window.location = `/surveys/${postedData.survey.id}`
    }))
  }

  return (
    <Page {...props} className={style.pageBody}>
      <Helmet>
        <title>ADMIN - Surveys</title>
      </Helmet>
      <PageHeader title='Surveys'>
        <Link className={style.link} to={`/surveys/new`}>New Survey</Link>
      </PageHeader>
      <h3 className={style.pageHeadline}>Create survey</h3>
      <div className={style.pageContent}>
        <div className={style.pageMain}>
          <form className={style.pageMain} onSubmit={onSubmit}>
            <Card>
              <InputField classNames={fieldStyles} label='Intro Title' htmlFor='intro-title'>
                <Input
                  type='text'
                  id='intro-title'
                  name='intro'
                  value={get(props, 'surveyPage.draft.intro', '')}
                  onChange={onChangeTitle}
                />
              </InputField>
              <InputField classNames={fieldStyles} label='Slug' htmlFor='slug'>
                <Input
                  type='text'
                  id='slug'
                  name='slug'
                  error={validateSlug()}
                  value={get(props, 'surveyPage.draft.slug', '')}
                  onChange={onChange}
                />
              </InputField>
              <InputField classNames={fieldStyles} label='Intro Description' htmlFor='intro-description'>
                <Input
                  type='textarea'
                  id='intro-description'
                  name='introDescription'
                  value={get(props, 'surveyPage.draft.introDescription', '')}
                  onChange={onChange}
                />
              </InputField>
              <InputField classNames={fieldStyles} label='Outro Title' htmlFor='outro-title'>
                <Input
                  type='text'
                  id='outro-title'
                  name='outro'
                  value={get(props, 'surveyPage.draft.outro', '')}
                  onChange={onChange}
                />
              </InputField>
              <InputField classNames={fieldStyles} label='Outro Description' htmlFor='outro-description'>
                <Input
                  type='textarea'
                  id='outro-description'
                  name='outroDescription'
                  value={get(props, 'surveyPage.draft.outroDescription', '')}
                  onChange={onChange}
                />
              </InputField>
              <InputField classNames={fieldStyles} label='Company' htmlFor='company'>
                { company.name || renderCompaniesList() }
              </InputField>
            </Card>
            <div className={style.formButtons}>
              <button className={style.submitButton}>SUBMIT</button>
            </div>
          </form>
        </div>
      </div>
    </Page>
  )
}

module.exports = NewSurveyPage
