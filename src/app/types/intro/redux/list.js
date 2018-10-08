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
      intros = [],
      url: {
        query
      }
    }
  } = props
  const currentFilters = Object.keys(query)

  return (
    <Page
      {...props}
      title={`Intros (${intros.length})`}
    >
      <Helmet>
        <title>{`ADMIN - Intros (${intros.length})`}</title>
      </Helmet>
      <ul>
        {intros.map(intro => (
          <RowItem
            key={get(intro, 'id')}
            title={`${get(intro, 'candidate.firstName')} ${get(intro, 'candidate.lastName')} (${get(intro, 'candidate.email')})`}
            details={[
              !currentFilters.includes('job') && {
                term: 'Job',
                description: `${get(intro, 'job.title')} (${get(intro, 'job.company.name')})`
              },
              {
                term: 'By',
                description: `${get(intro, 'person.firstName')} ${get(intro, 'person.lastName')} (${get(intro, 'person.email')})`
              },
              {
                term: 'Added',
                description: format(get(intro, 'created'), 'DD.MM.YYYY')
              }
            ].filter(Boolean)}
            actions={[
              // <Link to={`/intros/${intro.id}`}>See intro</Link>
            ]}
          />
        ))}
      </ul>
    </Page>
  )
}

module.exports = View
