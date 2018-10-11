const React = require('react')
const { Helmet } = require('react-helmet')
const { Text, Link } = require('@nudj/components')
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
        <Link href={`/people/${referral.person.id}`} subtle>{referral.person.firstName} {referral.person.lastName} ({referral.person.email})</Link>
      </p>
      <p className={style.formListItem}>
        <label className={style.label}>Job</label>
        <Link href={`/jobs/${referral.job.id}`} subtle>{referral.job.title} ({referral.job.company.name})</Link>
      </p>
      <p className={style.formListItem}>
        <label className={style.label}>Referred by</label>
        {referral.parent ? <Link href={`/referrals/${referral.parent.id}`} subtle>{referral.parent.person.firstName} {referral.parent.person.lastName} ({referral.parent.person.email})</Link> : <code>¯\_(ツ)_/¯</code>}
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
