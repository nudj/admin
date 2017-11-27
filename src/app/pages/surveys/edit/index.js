const React = require('react')
const get = require('lodash/get')
const { Helmet } = require('react-helmet')

const { Input, InputField, Card } = require('@nudj/components')
const actions = require('@nudj/framework/actions')
const { merge } = require('@nudj/library')

const { setSurveyDraft } = require('../actions')
const getStyle = require('./style.css')
const Page = require('../../../components/page')
const PageHeader = require('../../../components/page-header')

const SurveyPage = (props) => {
  const { survey } = props
  const company = get(survey, 'company', {})
  const style = getStyle()
  const fieldStyles = { root: style.field }

  const onChange = (event) => {
    const target = event.target || event
    const survey = get(props, 'surveyPage.draft', {})
    const draft = merge(survey, { [target.name]: target.value })
    props.dispatch(setSurveyDraft(draft))
  }

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
        <a className={style.link} href={`/surveys?company=${company.id}`}>Company Surveys</a>
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
        </div>
      </div>
    </Page>
  )
}

module.exports = SurveyPage
