// @flow
const React = require('react')
const { Helmet } = require('react-helmet')
const { Link } = require('react-router-dom')
const get = require('lodash/get')
const find = require('lodash/find')
const { parse } = require('query-string')

const {
  Input,
  InputField,
  Card,
  Table,
  Button,
  Select
} = require('@nudj/components')
const { merge } = require('@nudj/library')

const { setSurveyDraft, submitSurvey } = require('./actions')
const getStyle = require('./style.css')
const Page = require('../../components/page')
const PageHeader = require('../../components/page-header')

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

type SurveyPageProps = {
  dispatch: (Function) => {},
  companies: Array<Company>,
  surveys: Array<Survey>,
  location: Object,
  survey: Survey,
  surveyPage: PageProps
}

const SurveyPage = (props: SurveyPageProps) => {
  const {
    survey: existingSurvey,
    location,
    companies,
    surveys,
    surveyPage
  } = props

  const query = parse(get(location, 'search', ''))
  const draft = get(surveyPage, 'draft', {})
  const company = find(companies, { id: query.company }) || {}

  const style: Object = getStyle()
  const fieldStyles = { root: style.field }

  const onChange = event => {
    const target = event.target || event
    const data = merge(draft, { company: company.id }, {
      [target.name]: target.value
    })
    props.dispatch(setSurveyDraft(data))
  }

  const makeSlugFromTitle = title => {
    return title
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .replace(/\s/g, '-')
      .replace(/[^a-z0-9-]/g, '')
  }

  const onChangeTitle = event => {
    const title = event.value
    const slug = makeSlugFromTitle(title)
    const data = merge(draft, { [event.name]: title, slug })
    props.dispatch(setSurveyDraft(data))
  }

  const validateSlug = () => {
    const draftSlug = get(draft, 'slug', '')
    const slugs = surveys.map(survey => survey.slug)
    return slugs.includes(draftSlug) ? 'This slug already exists' : ''
  }

  const renderCompaniesList = () => (
    <Select
      className={style.selectBox}
      id='company'
      name='company'
      onChange={onChange}
      value={get(draft, 'company', '')}
      required
    >
      <option value=''>Choose a company</option>
      {companies.map((company, index) => (
        <option key={index} value={company.id}>
          {company.name}
        </option>
      ))}
    </Select>
  )

  const onSubmit = event => {
    event.preventDefault()
    props.dispatch(submitSurvey())
  }

  const sectionColumns = [
    { heading: 'Title', name: 'title' },
    { heading: 'Description', name: 'description' },
    { name: 'link' }
  ]

  const cellRenderer = (column, row, defaultRender) => {
    if (column.name === 'link') {
      return (
        <Link className={style.link} to={`/sections/${row.id}`}>
          View/Edit
        </Link>
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
        <Link className={style.link} to={`/survey/new`}>
          New Survey
        </Link>
        {existingSurvey.id && (
          <Link className={style.link} to={`/survey-sections?survey=${existingSurvey.id}`}>
            All Survey Sections
          </Link>
        )}
      </PageHeader>
      <h3 className={style.pageHeadline}>
        {existingSurvey.id ? 'Edit survey' : 'Create survey'}
      </h3>
      <div className={style.pageContent}>
        <div className={style.pageMain}>
          <Card>
            <form className={style.pageMain} onSubmit={onSubmit}>
              <InputField
                classNames={fieldStyles}
                label='Intro Title'
                htmlFor='intro-title'
              >
                <Input
                  type='text'
                  id='intro-title'
                  name='introTitle'
                  value={get(draft, 'introTitle', existingSurvey.introTitle)}
                  onChange={onChangeTitle}
                />
              </InputField>
              <InputField classNames={fieldStyles} label='Slug' htmlFor='slug'>
                <Input
                  required
                  type='text'
                  id='slug'
                  name='slug'
                  error={validateSlug()}
                  value={get(draft, 'slug', existingSurvey.slug)}
                  onChange={onChange}
                />
              </InputField>
              <InputField
                classNames={fieldStyles}
                label='Intro Description'
                htmlFor='intro-description'
              >
                <Input
                  type='textarea'
                  id='intro-description'
                  name='introDescription'
                  value={get(draft, 'introDescription', existingSurvey.introDescription)}
                  onChange={onChange}
                />
              </InputField>
              <InputField
                classNames={fieldStyles}
                label='Outro Title'
                htmlFor='outro-title'
              >
                <Input
                  type='text'
                  id='outro-title'
                  name='outroTitle'
                  value={get(draft, 'outroTitle', existingSurvey.outroTitle)}
                  onChange={onChange}
                />
              </InputField>
              <InputField
                classNames={fieldStyles}
                label='Outro Description'
                htmlFor='outro-description'
              >
                <Input
                  type='textarea'
                  id='outro-description'
                  name='outroDescription'
                  value={get(draft, 'outroDescription', existingSurvey.outroDescription)}
                  onChange={onChange}
                />
              </InputField>
              {existingSurvey.id ? (
                ''
              ) : (
                <InputField
                  classNames={fieldStyles}
                  label='Company'
                  htmlFor='company'
                >
                  {company.name || renderCompaniesList()}
                </InputField>
              )}
              <div className={style.formButtons}>
                <Button type='submit' volume='yell'>Submit</Button>
              </div>
            </form>
          </Card>
          {existingSurvey.id && (
            <div>
              <h3 className={style.pageHeadline}>
                Sections{' '}
                <span className={style.textHighlight}>
                  ({get(existingSurvey, 'sections.length', 0)})
                </span>
              </h3>
              <Table
                cellRenderer={cellRenderer}
                data={get(existingSurvey, 'sections')}
                columns={sectionColumns}
              />
            </div>
          )}
        </div>
      </div>
    </Page>
  )
}

SurveyPage.defaultProps = {
  survey: {},
  location: {},
  companies: [],
  surveys: [],
  surveyPage: {}
}

module.exports = SurveyPage
