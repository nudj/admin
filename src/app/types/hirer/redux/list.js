const React = require('react')
const { Helmet } = require('react-helmet')
const format = require('date-fns/format')
const { Link } = require('react-router-dom')

const Page = require('../../../components/page')
const RowItem = require('../../../components/row-item')
const Filters = require('../../../components/filters')
const getStyle = require('../../../lib/item/style.css')

const View = props => {
  const style = getStyle()
  const {
    app: {
      hirers = [],
      allHirers = [],
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
      title={`Hirers (${hirers.length}${
        currentFilters.length || (hirers.length !== allHirers.length) ? `/${allHirers.length}` : ''
      })`}
    >
      <Helmet>
        <title>{`ADMIN - Hirers (${hirers.length})`}</title>
      </Helmet>
      <Filters {...props} />
      <ul className={style.list}>
        {(hirers || []).map((hirer) => {
          const hirerCreatedDate = format(hirer.created, 'DD.MM.YYYY')
          const company = hirer.company

          return (<RowItem
            key={hirer.id}
            title={`${hirer.person.firstName} ${hirer.person.lastName}`}
            uri={`//${webHostname}/companies/${company.slug}/hirers/${hirer.slug}`}
            details={[!currentFilters.includes('company') && {
              term: 'Company',
              description: company.name
            }, {
              term: 'Type',
              description: hirer.type
            }, {
              term: 'Onboarded',
              description: `${!!hirer.onboarded}`
            }, {
              term: 'Added',
              description: hirerCreatedDate
            }]}
            actions={[
              <Link to={`/hirers/${hirer.id}`} className={style.button}>See hirer</Link>
            ]}
          />)
        })}
      </ul>
    </Page>
  )
}

module.exports = View
