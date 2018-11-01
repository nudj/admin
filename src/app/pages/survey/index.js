const React = require('react')
const { Helmet } = require('react-helmet')
const { Link: RRLink } = require('react-router-dom')
const get = require('lodash/get')
const find = require('lodash/find')
const { parse } = require('query-string')

const {
  Input,
  InputField,
  Card,
  Button,
  Select,
  Link
} = require('@nudj/components')
const { css, mss } = require('@nudj/components/styles')
const { merge } = require('@nudj/library')

const { setSurveyDraft, submitSurvey } = require('./actions')
const style = require('./style.css')
const Page = require('../../components/page')
const Breadcrumb = require('../../components/breadcrumb')
const PropTypes = require('../../lib/prop-types')

const SurveyPage = props => {
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
      className={css(style.selectBox)}
      id='company'
      name='company'
      onChange={onChange}
      value={get(draft, 'company', '')}
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

  return (
    <Page {...props} title='Surveys'>
      <Helmet>
        <title>ADMIN - Surveys</title>
      </Helmet>
      <Breadcrumb>
        <Link subtle inline volume='yell' href='/surveys'>
          All Surveys
        </Link>
        <span style={mss.bold}>Survey</span>
      </Breadcrumb>
      <h3 className={css(style.pageHeadline)}>
        {existingSurvey.id ? 'Edit survey' : 'Create survey'}
      </h3>
      <div className={css(style.pageContent)}>
        <div className={css(style.pageMain)}>
          <Card>
            <form className={css(style.pageMain)} onSubmit={onSubmit}>
              <InputField
                styleSheet={fieldStyles}
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
              <InputField styleSheet={fieldStyles} label='Slug' htmlFor='slug'>
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
                styleSheet={fieldStyles}
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
                styleSheet={fieldStyles}
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
                styleSheet={fieldStyles}
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
                  styleSheet={fieldStyles}
                  label='Company'
                  htmlFor='company'
                >
                  {company.name || renderCompaniesList()}
                </InputField>
              )}
              <div className={css(style.formButtons)}>
                <Button type='submit' volume='yell'>SUBMIT</Button>
              </div>
            </form>
          </Card>
          {existingSurvey.id && (
            <RRLink
              className={css(style.childrenButton)}
              to={`/surveys/${existingSurvey.id}/questions`}
            >
              Survey Questions
            </RRLink>
          )}
        </div>
      </div>
    </Page>
  )
}

SurveyPage.propTypes = {
  dispatch: PropTypes.function,
  companies: PropTypes.arrayOf(PropTypes.Company),
  surveys: PropTypes.arrayOf(PropTypes.Survey),
  location: PropTypes.Location,
  survey: PropTypes.Survey,
  surveyPage: PropTypes.shape({
    draft: PropTypes.Draft
  })
}

SurveyPage.defaultProps = {
  survey: {},
  location: {},
  companies: [],
  surveys: [],
  surveyPage: {}
}

module.exports = SurveyPage
