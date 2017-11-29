const React = require('react')
const { Helmet } = require('react-helmet')
const { Link } = require('react-router-dom')
const get = require('lodash/get')
const find = require('lodash/find')
const { parse } = require('query-string')

const { merge } = require('@nudj/library')
const {
  Input,
  InputField,
  Card,
  Table,
  Button,
  Select
} = require('@nudj/components')

const { setSurveySectionDraft, submitSurveySection } = require('./actions')
const getStyle = require('./style.css')
const Page = require('../../components/page')
const PageHeader = require('../../components/page-header')

const SurveySectionPage = props => {
  const {
    section: existingSection,
    location,
    surveys,
    surveySectionPage
  } = props

  const query = parse(get(location, 'search', ''))
  const draft = get(surveySectionPage, 'draft', {})
  const survey = find(surveys, { id: query.survey })

  const style = getStyle()
  const fieldStyles = { root: style.field }

  const onChange = event => {
    const target = event.target || event
    const data = merge(
      { survey: get(survey, 'id') },
      draft,
      {
        [target.name]: target.value
      }
    )
    props.dispatch(setSurveySectionDraft(data))
  }

  const onSubmit = event => {
    event.preventDefault()
    props.dispatch(submitSurveySection())
  }

  const sectionColumns = [
    { heading: 'Title', name: 'title' },
    { heading: 'Description', name: 'description' },
    { name: 'link' }
  ]

  const cellRenderer = (column, row, defaultRender) => {
    if (column.name === 'link') {
      return (
        <Link className={style.link} to={`/survey-section/${row.id}`}>
          View/Edit
        </Link>
      )
    }
    return defaultRender
  }

  const renderSurveyList = () => (
    survey ? (
      `${survey.title} - ${survey.company.name}`
    ) : (
      <Select
        id='select'
        name='survey'
        value={get(draft, 'survey', '')}
        onChange={onChange}
        required
      >
        <option value=''>Choose a survey</option>
        {
          surveys.map((survey, index) => (
            <option key={index} value={survey.id}>
              {`${survey.title} - ${survey.company.name}`}
            </option>
          ))
        }
      </Select>
  ))

  return (
    <Page {...props} className={style.pageBody}>
      <Helmet>
        <title>ADMIN - Surveys</title>
      </Helmet>
      <PageHeader title='Surveys'>
        <Link className={style.link} to='/survey-section/new'>
          New Survey
        </Link>
      </PageHeader>
      <h3 className={style.pageHeadline}>
        {existingSection.id ? 'Edit section' : 'Create section'}
      </h3>
      <div className={style.pageContent}>
        <div className={style.pageMain}>
          <Card>
            <form className={style.pageMain} onSubmit={onSubmit}>
              <InputField
                classNames={fieldStyles}
                label='Title'
                htmlFor='title'
                required
              >
                <Input
                  type='text'
                  id='title'
                  name='title'
                  value={get(draft, 'title', existingSection.title)}
                  onChange={onChange}
                  required
                />
              </InputField>
              <InputField
                classNames={fieldStyles}
                label='Description'
                htmlFor='description'
              >
                <Input
                  required
                  type='text'
                  id='description'
                  name='description'
                  value={get(draft, 'description', existingSection.description)}
                  onChange={onChange}
                />
              </InputField>
              <InputField
                classNames={fieldStyles}
                label='Survey'
                htmlFor='survey'
                required
              >
                {existingSection.id ? (
                  `${existingSection.survey.title} - ${existingSection.survey.company.name}`
                ) : (
                  renderSurveyList()
                )}
              </InputField>
              <div className={style.formButtons}>
                <Button type='submit' volume='yell'>
                  SUBMIT
                </Button>
              </div>
            </form>
          </Card>
          {existingSection.id && (
            <div>
              <h3 className={style.pageHeadline}>
                Sections{' '}
                <span className={style.textHighlight}>
                  ({get(existingSection, 'sections.length', 0)})
                </span>
              </h3>
              <Table
                cellRenderer={cellRenderer}
                data={get(existingSection, 'sections')}
                columns={sectionColumns}
              />
            </div>
          )}
        </div>
      </div>
    </Page>
  )
}

SurveySectionPage.defaultProps = {
  section: {},
  location: {},
  surveys: [],
  surveySectionPage: {}
}

module.exports = SurveySectionPage
