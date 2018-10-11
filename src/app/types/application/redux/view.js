const React = require('react')
const { Helmet } = require('react-helmet')
const { Text, Link } = require('@nudj/components')
const format = require('date-fns/format')

const Page = require('../../../components/page')
const getStyle = require('../../../lib/item/style.css')

const View = props => {
  const style = getStyle()
  const { app: { application = {} } } = props
  return (
    <Page
      {...props}
      title='Application details'
      description={``}
    >
      <Helmet>
        <title>{`ADMIN - Application details`}</title>
      </Helmet>
      <p className={style.formListItem}>
        <label className={style.label}>Applicant</label>
        <Link href={`/people/${application.person.id}`} subtle>{application.person.firstName} {application.person.lastName} ({application.person.email})</Link>
      </p>
      <p className={style.formListItem}>
        <label className={style.label}>Job</label>
        <Link href={`/jobs/${application.job.id}`} subtle>{application.job.title} ({application.job.company.name})</Link>
      </p>
      <p className={style.formListItem}>
        <label className={style.label}>Referred by</label>
        {application.referral ? <Link href={`/referrals/${application.referral.id}`} subtle>{application.referral.person.firstName} {application.referral.person.lastName} ({application.referral.person.email})</Link> : <code>¯\_(ツ)_/¯</code>}
      </p>
      <p className={style.formListItem}>
        <label className={style.label}>Created</label>
        <Text>{format(application.created, 'DD/MM/YYYY HH:mm:ss')}</Text>
      </p>
      <p className={style.formListItem}>
        <label className={style.label}>Modified</label>
        <Text>{format(application.modified, 'DD/MM/YYYY HH:mm:ss')}</Text>
      </p>
    </Page>
  )
}

module.exports = View
