const React = require('react')
const { Helmet } = require('react-helmet')
const format = require('date-fns/format')
const get = require('lodash/get')

const Page = require('../../../components/page')
const RowItem = require('../../../components/row-item')
const Filters = require('../../../components/filters')
const getStyle = require('../../../lib/item/style.css')

const View = props => {
  const style = getStyle()
  const {
    app: {
      applications = [],
      allApplications = [],
      url: {
        query
      }
    }
  } = props
  const currentFilters = Object.keys(query)

  return (
    <Page
      {...props}
      title={`Applications (${applications.length}/${allApplications.length})`}
    >
      <Helmet>
        <title>{`ADMIN - Applications (${applications.length})`}</title>
      </Helmet>
      <Filters {...props} />
      <ul className={style.list}>
        {applications.map(application => (
          <RowItem
            key={get(application, 'id')}
            title={`${get(application, 'person.firstName')} ${get(application, 'person.lastName')} (${get(application, 'person.email')})`}
            details={[
              !currentFilters.includes('job') && {
                term: 'Job',
                description: `${get(application, 'job.title')} (${get(application, 'job.company.name')})`
              },
              {
                term: 'Added',
                description: format(get(application, 'created'), 'DD.MM.YYYY')
              },
              application.referral && {
                term: 'Referral',
                description: `${get(application, 'referral.person.firstName')} ${get(application, 'referral.person.lastName')} (${get(application, 'referral.person.email')})`
              }
            ]}
          />
        ))}
      </ul>
    </Page>
  )
}

module.exports = View
