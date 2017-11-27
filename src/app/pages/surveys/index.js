const React = require('react')
const get = require('lodash/get')
const { Helmet } = require('react-helmet')

const { Table, Input, InputField, Card } = require('@nudj/components')
const actions = require('@nudj/framework/actions')

const getStyle = require('./style.css')
const Page = require('../../components/page')
const { Link } = require('react-router-dom')
const PageHeader = require('../../components/page-header')

const SurveyPage = (props) => {
  const surveys = get(props, 'surveys', [])
  const query = get(props, 'location.search', '')
  const style = getStyle()

  const columns = [
    { heading: 'Company', name: 'company.name' },
    { heading: 'Intro Title', name: 'title' },
    { heading: 'Description', name: 'description' },
    { name: 'link' }
  ]

  const cellRenderer = (column, row, defaultRender) => {
    if (column.name === 'link') {
      return <Link className={style.link} to={`/surveys/${row.id}`}>View/Edit</Link>
    }
    return defaultRender
  }

  const renderTable = () => (
    <Table cellRenderer={cellRenderer} data={surveys} columns={columns} />
  )

  const onSubmit = (event) => {
    event.preventDefault()

    const url = `/surveys/new`
    const data = {
      survey: ''
    }
    const method = 'post'

    props.dispatch(actions.app.postData({ url, data, method }))
  }

  const renderForm = () => {
    return (
      <form className={style.pageMain} onSubmit={onSubmit}>
        <Card>
          <InputField htmlFor='test'>
            <Input type='text' id='test' name='test-name' />
          </InputField>
        </Card>
        <div className={style.formButtons}>
          <button className={style.submitButton}>SUBMIT</button>
        </div>
      </form>
    )
  }

  return (
    <Page {...props} className={style.pageBody}>
      <Helmet>
        <title>ADMIN - Surveys</title>
      </Helmet>
      <PageHeader title='Surveys'>
        <Link className={style.link} to={`/surveys/new${query}`}>New Survey</Link>
      </PageHeader>
      <h3 className={style.pageHeadline}>Surveys <span className={style.textHighlight}>({surveys.length})</span></h3>
      <div className={style.pageContent}>
        <div className={style.pageMain}>
          { props.newSurvey ? renderForm() : renderTable() }
        </div>
      </div>
    </Page>
  )
}

module.exports = SurveyPage
