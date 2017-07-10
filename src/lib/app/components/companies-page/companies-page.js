const React = require('react')
const { Link } = require('react-router-dom')
const get = require('lodash/get')
const format = require('date-fns/format')
const { Helmet } = require('react-helmet')
const getStyle = require('./companies-page.css')
const Plural = require('../plural/plural')
const PageHeader = require('../page-header/page-header')
const RowItem = require('../row-item/row-item')
const Tooltip = require('../tooltip/tooltip')

const CompaniesPage = (props) => {
  const style = getStyle()
  const companies = get(props, 'companies', [])
  const tooltip = get(props, 'tooltip')
  return (
    <div className={style.pageBody}>
      <Helmet>
        <title>nudj - Companies</title>
      </Helmet>
      <PageHeader title='Companies' />
      <h3 className={style.pageHeadline}>{companies.length} <Plural count={companies.length} singular='company' plural='companies' /> listed on nudj...</h3>
      <div className={style.pageContent}>
        <div className={style.pageMain}>
          <ul className={style.jobs}>
            {companies.map((company) => (
              <RowItem
                key={get(company, 'slug')}
                title={get(company, 'name')}
                details={[{
                  term: 'Location',
                  description: get(company, 'location')
                }, {
                  term: 'Added',
                  description: format(get(company, 'created'), 'DD.MM.YYYY')
                }, {
                  term: 'Bonus',
                  description: `£${get(company, 'bonus')}`
                }]}
                actions={[
                  <Link className={style.nudj} to={`/${get(company, 'slug')}/jobs`}>Nudjy nudjy nudj nudj</Link>
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

module.exports = CompaniesPage
