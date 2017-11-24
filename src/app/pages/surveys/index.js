const React = require('react')
const get = require('lodash/get')
const { Helmet } = require('react-helmet')

const getStyle = require('./style.css')
const Page = require('../../components/page')
const PageHeader = require('../../components/page-header')
const Tooltip = require('../../components/tooltip')

const SurveyPage = (props) => {
  const surveys = get(props, 'surveys', [])
  const tooltip = get(props, 'tooltip')
  const style = getStyle()

  return (
    <Page {...props} className={style.pageBody}>
      <Helmet>
        <title>ADMIN - Surveys</title>
      </Helmet>
      <PageHeader title='People' />
      <h3 className={style.pageHeadline}>Surveys <span className={style.textHighlight}>({surveys.length})</span></h3>
      <div className={style.pageContent}>
        <div className={style.pageSidebar}>
          {tooltip ? <Tooltip {...tooltip} /> : ''}
        </div>
      </div>
      <div className={style.pageContent}>
        <div className={style.pageSidebar} />
      </div>
    </Page>
  )
}

module.exports = SurveyPage
