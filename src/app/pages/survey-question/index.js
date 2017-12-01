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
  Button,
  Checkbox,
  Select
} = require('@nudj/components')

const { setSurveyQuestionDraft, createOrUpdateSurveyQuestion } = require('./actions')
const getStyle = require('./style.css')
const Page = require('../../components/page')
const PageHeader = require('../../components/page-header')
const { questionTypes } = require('../../lib/constants')

const SurveyQuestionPage = props => {
  const {
    question: existingQuestion,
    location,
    surveySections,
    surveyQuestionPage
  } = props

  const query = get(location, 'search', '')
  const draft = get(surveyQuestionPage, 'draft', {})
  const filters = parse(query)
  const section = find(surveySections, { id: filters.section })

  const style = getStyle()
  const fieldStyles = { root: style.field }

  const onChange = event => {
    const data = merge(
      { section: get(section, 'id') },
      draft,
      {
        [event.name]: event.value
      }
    )
    props.dispatch(setSurveyQuestionDraft(data))
  }

  const onCheck = event => {
    const data = { [event.name]: event.checked }
    props.dispatch(setSurveyQuestionDraft(data))
  }

  const onSubmit = event => {
    event.preventDefault()
    props.dispatch(createOrUpdateSurveyQuestion())
  }

  const renderSectionList = () => (
    section ? (
      `${section.title}`
    ) : (
      <Select
        id='select'
        name='section'
        value={get(draft, 'section', '')}
        onChange={onChange}
        required
      >
        <option disabled value=''>Choose a section</option>
        {
          surveySections.map((section, index) => (
            <option key={index} value={section.id}>
              {section.title}
            </option>
          ))
        }
      </Select>
  ))

  const queryString = (
    existingQuestion.id ? `?section=${existingQuestion.section.id}` : query
  )

  return (
    <Page {...props} className={style.pageBody}>
      <Helmet>
        <title>ADMIN - Surveys</title>
      </Helmet>
      <PageHeader title='Surveys'>
        <Link className={style.link} to={`/survey-question/new${queryString}`}>
          New Survey Question
        </Link>
        {existingQuestion.id && (
          <Link className={style.link} to={`/section/${existingQuestion.section.id}/questions`}>
            Section Questions
          </Link>
        )}
      </PageHeader>
      <h3 className={style.pageHeadline}>
        {existingQuestion.id ? 'Edit question' : 'Create question'}
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
                  value={get(draft, 'title', existingQuestion.title)}
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
                  value={get(draft, 'description', existingQuestion.description)}
                  onChange={onChange}
                />
              </InputField>
              <InputField
                classNames={fieldStyles}
                label='Name'
                htmlFor='name'
              >
                <Input
                  required
                  type='text'
                  id='name'
                  name='name'
                  value={get(draft, 'name', existingQuestion.name)}
                  onChange={onChange}
                />
              </InputField>
              <InputField
                classNames={fieldStyles}
                label='Type'
                htmlFor='type'
              >
                <Select
                  id='select'
                  name='type'
                  value={get(draft, 'type', existingQuestion.type)}
                  onChange={onChange}
                  required
                >
                  <option disabled value=''>Choose a type</option>
                  {
                    Object.keys(questionTypes).map((type, index) => (
                      <option key={index} value={type}>
                        {type}
                      </option>
                    ))
                  }
                </Select>
              </InputField>
              <InputField
                classNames={fieldStyles}
                label='Section'
                htmlFor='section'
                required
              >
                {existingQuestion.id ? (
                  `${existingQuestion.section.title}`
                ) : (
                  renderSectionList()
                )}
              </InputField>
              <InputField
                classNames={fieldStyles}
                label='Required?'
                htmlFor='required'
              >
                <Checkbox
                  checked={get(draft, 'required', existingQuestion.required)}
                  id='required'
                  name='required'
                  onChange={onCheck}
                />
              </InputField>
              <div className={style.formButtons}>
                <Button type='submit' volume='yell'>
                  SUBMIT
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </Page>
  )
}

SurveyQuestionPage.defaultProps = {
  question: {},
  location: {},
  surveySections: [],
  surveyQuestionPage: {}
}

module.exports = SurveyQuestionPage
