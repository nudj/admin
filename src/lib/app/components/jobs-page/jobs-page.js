const React = require('react')
const { Link } = require('react-router-dom')
const get = require('lodash/get')
const format = require('date-fns/format')
const { Helmet } = require('react-helmet')
const getStyle = require('./jobs-page.css')
const PageHeader = require('../page-header/page-header')
const RowItem = require('../row-item/row-item')
const Tooltip = require('../tooltip/tooltip')
const Plural = require('../plural/plural')

const JobsPage = (props) => {
  const style = getStyle()
  const jobs = get(props, 'jobs', [])
  const company = get(props, 'company', {})
  const tooltip = get(props, 'tooltip')
  return (
    <div className={style.pageBody}>
      <Helmet>
        <title>{`nudj - Jobs @ ${get(props, 'company.name')}`}</title>
      </Helmet>
      <PageHeader title='Jobs' subtitle={`@ ${get(props, 'company.name')}`} />
      <h3 className={style.pageHeadline}>
        <span className={style.pageHeadlineHighlight}>{get(company, 'name')}</span> currently have {jobs.length} <Plural count={jobs.length} singular='job' plural='jobs' /> listed on nudj...
      </h3>
      <div className={style.pageContent}>
        <div className={style.pageMain}>
          <ul className={style.jobs}>
            {jobs.map((job) => (
              <RowItem
                key={get(job, 'slug')}
                title={get(job, 'title')}
                uri={`//nudj.co/jobs/${get(props, 'company.slug')}+${get(job, 'slug')}`}
                details={[{
                  term: 'Location',
                  description: get(job, 'location')
                }, {
                  term: 'Added',
                  description: format(get(job, 'created'), 'DD.MM.YYYY')
                }, {
                  term: 'Bonus',
                  description: `£${get(job, 'bonus')}`
                }]}
                actions={[
                  <Link className={style.nudj} to={`/${get(company, 'slug')}/jobs/${get(job, 'slug')}`}>Nudjy nudjy nudj nudj</Link>
                ]}
              />
            ))}
          </ul>
        </div>
        <div className={style.pageSidebar}>
          {tooltip ? <Tooltip {...tooltip} /> : ''}
        </div>
      </div>
    </div>
  )
}

module.exports = JobsPage
