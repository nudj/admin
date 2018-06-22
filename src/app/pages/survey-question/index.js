const React = require('react')
const { Helmet } = require('react-helmet')
const get = require('lodash/get')

const { merge } = require('@nudj/library')
const { css, mss } = require('@nudj/components/styles')
const {
  CheckboxGroup,
  Link,
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
const Breadcrumb = require('../../components/breadcrumb')
const { questionTypes, expertiseTags } = require('../../lib/constants')
const PropTypes = require('../../lib/prop-types')

const SurveyQuestionPage = props => {
  const {
    question: existingQuestion,
    surveyQuestionPage,
    survey
  } = props

  const draft = get(surveyQuestionPage, 'draft', {})
  const tagsUpdated = get(surveyQuestionPage, 'tagsUpdated', false)
  const tags = get(surveyQuestionPage, 'tags', [])
  const fieldStyles = { root: style.field }

  const onChangeTags = event => {
    props.dispatch(setSurveyQuestionTags(event.values))
  }

  const onChange = event => {
    const data = merge(draft, {
      [event.name]: event.value
    })
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

  const breadcrumbSurveyId = get(existingQuestion, 'survey.id') || get(survey, 'id')

  return (
    <Page
      {...props}
      title='Surveys'
    >
      <Helmet>
        <title>ADMIN - Surveys</title>
      </Helmet>
      <Breadcrumb>
        <Link subtle inline volume='yell' href='/surveys'>
          All Surveys
        </Link>
        <Link subtle inline volume='yell' href={`/surveys/${breadcrumbSurveyId}`}>
          Survey
        </Link>
        <Link subtle inline volume='yell' href={`/surveys/${breadcrumbSurveyId}/questions`}>
          Questions
        </Link>
        <span style={mss.bold}>{get(existingQuestion, 'title', 'New question')}</span>
      </Breadcrumb>
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
                  styles={style.tags}
                  values={tagsUpdated ? tags : existingQuestion.tags.map(tag => tag.name)}
                >
                  {
                    checkbox => Object.keys(expertiseTags).map(tag => checkbox({
                      id: tag,
                      key: tag,
                      value: tag,
                      label: expertiseTags[tag]
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

SurveyQuestionPage.propTypes = {
  question: PropTypes.SurveyQuestion,
  dispatch: PropTypes.function.isRequired,
  surveyQuestionPage: PropTypes.shape({
    draft: PropTypes.Draft
  })
}

SurveyQuestionPage.defaultProps = {
  question: {
    survey: {},
    tags: []
  },
  survey: {},
  surveyQuestionPage: {}
}

module.exports = SurveyQuestionPage
