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
  console.log(props)
  const {
    survey: existingSurvey,
    location,
    surveys,
    surveyPage
  } = props

  const query = parse(get(location, 'search', ''))
  const draft = get(surveyPage, 'draft', {})
  const survey = find(surveys, { id: query.survey })

  const style = getStyle()
  const fieldStyles = { root: style.field }

  const onChange = event => {
    const target = event.target || event
    const data = merge(
      { company: get(survey, 'id') },
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
    <Select
      id='select'
      name='select'
      value='first'
      onChange={onChange}
    >
      {
        surveys.map((survey, index) => (
          <option key={index} value={survey.id}>
            {`${survey.title} - ${survey.company.name}`}
          </option>
        ))
      }
    </Select>
  )

  return (
    <Page {...props} className={style.pageBody}>
      <Helmet>
        <title>ADMIN - Surveys</title>
      </Helmet>
      <PageHeader title='Surveys'>
        <Link className={style.link} to='/survey/new'>
          New Section
        </Link>
      </PageHeader>
      <h3 className={style.pageHeadline}>
        {existingSurvey.id ? 'Edit section' : 'Create section'}
      </h3>
      <div className={style.pageContent}>
        <div className={style.pageMain}>
          <Card>
            <form className={style.pageMain} onSubmit={onSubmit}>
              <InputField
                classNames={fieldStyles}
                label='Title'
                htmlFor='title'
              >
                <Input
                  type='text'
                  id='title'
                  name='title'
                  value={get(draft, 'title', existingSurvey.title)}
                  onChange={onChange}
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
                  value={get(draft, 'description', existingSurvey.description)}
                  onChange={onChange}
                />
              </InputField>
              <InputField
                classNames={fieldStyles}
                label='Survey'
                htmlFor='survey'
              >
                { survey ? `${survey.title} - ${survey.company.name}` : renderSurveyList()}
              </InputField>
              <div className={style.formButtons}>
                <Button type='submit' volume='yell'>
                  SUBMIT
                </Button>
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

SurveySectionPage.defaultProps = {
  survey: {},
  location: {},
  surveys: [],
  surveySectionPage: {}
}

module.exports = SurveySectionPage
