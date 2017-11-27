const React = require('react')
const get = require('lodash/get')
const find = require('lodash/find')
const { Helmet } = require('react-helmet')

const { Input, InputField, Card } = require('@nudj/components')
const actions = require('@nudj/framework/actions')
const { merge } = require('@nudj/library')

const { setSurveyDraft } = require('../actions')
const getStyle = require('./style.css')
const Page = require('../../../components/page')
const { Link } = require('react-router-dom')
const PageHeader = require('../../../components/page-header')

const SurveyPage = (props) => {
  console.log(props)
  const company = get(props, 'survey.company', {})
  const companies = get(props, 'companies')
  const style = getStyle()
  const fieldStyles = { root: style.field }

  const onChange = (event) => {
    const target = event.target || event
    const survey = get(props, 'surveysPage.draft', {})
    const draft = merge(survey, { [target.name]: target.value })
    props.dispatch(setSurveyDraft(draft))
  }

  const renderCompaniesList = () => (
    <select className={style.selectBox} id='personType' name='company' onChange={onChange}>
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
    const draft = get(props, 'surveysPage.draft', {})
    const data = company.id ? merge(draft, { company: company.id }) : draft
    const validCompany = !!find(companies, { id: data.company })

    if (!validCompany) {
      return props.dispatch(actions.app.showNotification({ type: 'error', message: 'Please choose a company' }))
    }

    const url = `/surveys`
    const method = 'post'
    return props.dispatch(actions.app.postData({ url, data, method }))
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
                  value={get(props, 'surveysPage.draft.intro', '')}
                  onChange={onChange}
                />
              </InputField>
              <InputField classNames={fieldStyles} label='Intro Description' htmlFor='intro-description'>
                <Input
                  type='textarea'
                  id='intro-description'
                  name='introDescription'
                  value={get(props, 'surveysPage.draft.introDescription', '')}
                  onChange={onChange}
                />
              </InputField>
              <InputField classNames={fieldStyles} label='Outro Title' htmlFor='outro-title'>
                <Input
                  type='text'
                  id='outro-title'
                  name='outro'
                  value={get(props, 'surveysPage.draft.outro', '')}
                  onChange={onChange}
                />
              </InputField>
              <InputField classNames={fieldStyles} label='Outro Description' htmlFor='outro-description'>
                <Input
                  type='textarea'
                  id='outro-description'
                  name='outroDescription'
                  value={get(props, 'surveysPage.draft.outroDescription', '')}
                  onChange={onChange}
                />
              </InputField>
              <InputField classNames={fieldStyles} label='Company: ' htmlFor='personType'>
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

module.exports = SurveyPage
