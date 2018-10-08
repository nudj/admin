const React = require('react')
const { Helmet } = require('react-helmet')
const format = require('date-fns/format')
const { Link } = require('react-router-dom')

const Page = require('../../../components/page')
const RowItem = require('../../../components/row-item')

const View = props => {
  const {
    app: {
      jobs = [],
      url: {
        query
      }
    },
    web: {
      hostname: webHostname
    }
  } = props
  const currentFilters = Object.keys(query)

  return (
    <Page
      {...props}
      title={`Jobs (${jobs.length})`}
    >
      <Helmet>
        <title>{`ADMIN - Jobs (${jobs.length})`}</title>
      </Helmet>
      <ul>
        {(jobs || []).map((job) => {
          const jobCreatedDate = format(job.created, 'DD.MM.YYYY')
          const company = job.company

          return (<RowItem
            key={job.slug}
            title={job.title}
            uri={`//${webHostname}/companies/${company.slug}/jobs/${job.slug}`}
            details={[!currentFilters.includes('company') && {
              term: 'Company',
              description: company.name
            }, {
              term: 'Status',
              description: job.status
            }, {
              term: 'Location',
              description: job.location
            }, {
              term: 'Added',
              description: jobCreatedDate
            }, {
              term: 'Bonus',
              description: job.bonus
            }].filter(Boolean)}
            actions={[
              <Link to={`/jobs/${job.id}`}>See job</Link>
            ]}
          />)
        })}
      </ul>
    </Page>
  )
}

module.exports = View
