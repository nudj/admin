const React = require('react')
const { Helmet } = require('react-helmet')
const { Text } = require('@nudj/components')
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
        <Text>{application.person.firstName} {application.person.lastName} ({application.person.email})</Text>
      </p>
      <p className={style.formListItem}>
        <label className={style.label}>Job</label>
        <Text>{application.job.title} ({application.job.company.name})</Text>
      </p>
      <p className={style.formListItem}>
        <label className={style.label}>Referred by</label>
        <Text>{application.referral ? `${application.referral.person.firstName} ${application.referral.person.lastName} (${application.referral.person.email})` : <code>¯\_(ツ)_/¯</code>}</Text>
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
