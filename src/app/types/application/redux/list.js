const React = require('react')
const { Helmet } = require('react-helmet')
const format = require('date-fns/format')
// const { Link } = require('react-router-dom')
const get = require('lodash/get')

const Page = require('../../../components/page')
const RowItem = require('../../../components/row-item')

const View = props => {
  const {
    app: {
      applications = [],
      url: {
        query
      }
    }
  } = props
  const currentFilters = Object.keys(query)

  return (
    <Page
      {...props}
      title={`Applications (${applications.length})`}
    >
      <Helmet>
        <title>{`ADMIN - Applications (${applications.length})`}</title>
      </Helmet>
      <ul>
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
            ].filter(Boolean)}
            actions={[
              // <Link to={`/applications/${application.id}`}>See application</Link>
            ]}
          />
        ))}
      </ul>
    </Page>
  )
}

module.exports = View
