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
      referrals = [],
      allReferrals = [],
      url: {
        query
      }
    }
  } = props
  const currentFilters = Object.keys(query)

  return (
    <Page
      {...props}
      title={`Referrals (${referrals.length}/${allReferrals.length})`}
    >
      <Helmet>
        <title>{`ADMIN - Referrals (${referrals.length})`}</title>
      </Helmet>
      <Filters {...props} />
      <ul className={style.list}>
        {referrals.map(referral => (
          <RowItem
            key={get(referral, 'id')}
            title={`${get(referral, 'person.firstName')} ${get(referral, 'person.lastName')} (${get(referral, 'person.email')})`}
            details={[
              !currentFilters.includes('job') && {
                term: 'Job',
                description: `${get(referral, 'job.title')} (${get(referral, 'job.company.name')})`
              },
              {
                term: 'Added',
                description: format(get(referral, 'created'), 'DD.MM.YYYY')
              },
              referral.parent && {
                term: 'Parent',
                description: `${get(referral, 'parent.person.firstName')} ${get(referral, 'parent.person.lastName')} (${get(referral, 'parent.person.email')})`
              }
            ]}
          />
        ))}
      </ul>
    </Page>
  )
}

module.exports = View
