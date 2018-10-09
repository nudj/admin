const React = require('react')
const { Helmet } = require('react-helmet')
const { Text } = require('@nudj/components')
const format = require('date-fns/format')

const Page = require('../../../components/page')
const getStyle = require('../../../lib/item/style.css')

const View = props => {
  const style = getStyle()
  const { app: { referral = {} } } = props
  return (
    <Page
      {...props}
      title='Referral details'
      description={``}
    >
      <Helmet>
        <title>{`ADMIN - Referral details`}</title>
      </Helmet>
      <p className={style.formListItem}>
        <label className={style.label}>Person</label>
        <Text>{referral.person.firstName} {referral.person.lastName} ({referral.person.email})</Text>
      </p>
      <p className={style.formListItem}>
        <label className={style.label}>Job</label>
        <Text>{referral.job.title} ({referral.job.company.name})</Text>
      </p>
      <p className={style.formListItem}>
        <label className={style.label}>Referred by</label>
        <Text>{referral.parent ? `${referral.parent.person.firstName} ${referral.parent.person.lastName} (${referral.parent.person.email})` : <code>¯\_(ツ)_/¯</code>}</Text>
      </p>
      <p className={style.formListItem}>
        <label className={style.label}>Created</label>
        <Text>{format(referral.created, 'DD/MM/YYYY HH:mm:ss')}</Text>
      </p>
      <p className={style.formListItem}>
        <label className={style.label}>Modified</label>
        <Text>{format(referral.modified, 'DD/MM/YYYY HH:mm:ss')}</Text>
      </p>
    </Page>
  )
}

module.exports = View
