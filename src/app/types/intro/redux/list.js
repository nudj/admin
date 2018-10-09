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
      intros = [],
      allIntros = [],
      url: {
        query
      }
    }
  } = props
  const currentFilters = Object.keys(query)

  return (
    <Page
      {...props}
      title={`Intros (${intros.length}/${allIntros.length})`}
    >
      <Helmet>
        <title>{`ADMIN - Intros (${intros.length})`}</title>
      </Helmet>
      <Filters {...props} />
      <ul className={style.list}>
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
            ]}
          />
        ))}
      </ul>
    </Page>
  )
}

module.exports = View
