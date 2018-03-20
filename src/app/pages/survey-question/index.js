/* global Dispatch Draft SurveySection SurveyQuestion Location */
// @flow
const React = require('react')
const { Helmet } = require('react-helmet')
const { Link } = require('react-router-dom')
const get = require('lodash/get')
const find = require('lodash/find')
const values = require('lodash/values')
const startCase = require('lodash/startCase')
const { parse } = require('query-string')

const { merge } = require('@nudj/library')
const { css } = require('@nudj/components/lib/css')
const CheckboxGroup = require('@nudj/components/lib/components/checkbox-group')
const {
  Input,
  InputField,
  Card,
  Button,
  Checkbox,
  Select
} = require('@nudj/components')

const {
  setSurveyQuestionDraft,
  setSurveyQuestionTags,
  createOrUpdateSurveyQuestion
} = require('./actions')
const style = require('./style.css')
const Page = require('../../components/page')
const PageHeader = require('../../components/page-header')
const { questionTypes, expertiseTags } = require('../../lib/constants')

type SurveyQuestionPageProps = {
  question: SurveyQuestion,
  surveySections: Array<SurveySection>,
  location: Location,
  dispatch: Dispatch,
  surveyQuestionPage: {
    draft?: Draft
  }
}

const SurveyQuestionPage = (props: SurveyQuestionPageProps) => {
  const {
    question: existingQuestion,
    location,
    surveySections,
    surveyQuestionPage
  } = props

  const query = get(location, 'search', '')
  const draft = get(surveyQuestionPage, 'draft', {})
  const tagsUpdated = get(surveyQuestionPage, 'tagsUpdated', false)
  const tags = get(surveyQuestionPage, 'tags')
  const filters = parse(query)
  const section = find(surveySections, { id: filters.section })
  const fieldStyles = { root: style.field }

  const onChangeTags = event => {
    props.dispatch(setSurveyQuestionTags(event.values))
  }

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
        <option value=''>Choose a section</option>
        {
          surveySections.map((section, index) => (
            <option key={index} value={section.id}>
              {section.title}
            </option>
          ))
        }
      </Select>
  ))

  const sectionId = get(existingQuestion, 'section.id')

  const queryString = (
    existingQuestion.id ? `?section=${sectionId}` : query
  )

  return (
    <Page {...props} className={css(style.pageBody)}>
      <Helmet>
        <title>ADMIN - Surveys</title>
      </Helmet>
      <PageHeader title='Surveys'>
        <Link className={css(style.link)} to={`/survey-questions/new${queryString}`}>
          New Section Question
        </Link>
        {existingQuestion.id && (
          <Link className={css(style.link)} to={`/survey-sections/${sectionId}/questions`}>
            Section Questions
          </Link>
        )}
      </PageHeader>
      <h3 className={css(style.pageHeadline)}>
        {existingQuestion.id ? 'Edit question' : 'Create question'}
      </h3>
      <div className={css(style.pageContent)}>
        <div className={css(style.pageMain)}>
          <Card>
            <form className={css(style.pageMain)} onSubmit={onSubmit}>
              <InputField
                styleSheet={fieldStyles}
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
                styleSheet={fieldStyles}
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
                styleSheet={fieldStyles}
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
                styleSheet={fieldStyles}
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
                  <option value=''>Choose a type</option>
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
                styleSheet={fieldStyles}
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
                styleSheet={fieldStyles}
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
              <InputField
                styleSheet={fieldStyles}
                label='Tags'
                htmlFor='tags'
              >
                <CheckboxGroup
                  id='tags'
                  name='tags'
                  onChange={onChangeTags}
                  values={tagsUpdated ? tags : existingQuestion.tags}
                >
                  {
                    checkbox => values(expertiseTags).map(tag => checkbox({
                      id: tag,
                      key: tag,
                      value: tag,
                      label: startCase(tag)
                    }))
                  }
                </CheckboxGroup>
              </InputField>
              <div className={css(style.formButtons)}>
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
