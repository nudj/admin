const React = require('react')
const { Helmet } = require('react-helmet')
const { Link } = require('react-router-dom')
const { Text, Link: NudjLink } = require('@nudj/components')
const format = require('date-fns/format')

const Page = require('../../../components/page')
const getStyle = require('../../../lib/item/style.css')

const View = props => {
  const style = getStyle()
  const { app: { job = {} } } = props
  return (
    <Page
      {...props}
      title={`${job.title} @ ${job.company.name}`}
    >
      <Helmet>
        <title>{`ADMIN - ${job.title}`}</title>
      </Helmet>
      <p className={style.formListItem}>
        <label className={style.label}>Title</label>
        <Text>{job.title}</Text>
      </p>
      <p className={style.formListItem}>
        <label className={style.label}>Slug</label>
        <Text>{job.slug}</Text>
      </p>
      <p className={style.formListItem}>
        <label className={style.label}>Company</label>
        <NudjLink href={`/companies/${job.company.slug}`} subtle>{job.company.name}</NudjLink>
      </p>
      <p className={style.formListItem}>
        <label className={style.label}>Bonus</label>
        <Text>{job.bonus}</Text>
      </p>
      <p className={style.formListItem}>
        <label className={style.label}>Remuneration</label>
        <Text>{job.remuneration}</Text>
      </p>
      <p className={style.formListItem}>
        <label className={style.label}>Location</label>
        <Text>{job.location}</Text>
      </p>
      <p className={style.formListItem}>
        <label className={style.label}>Status</label>
        <Text>{job.status}</Text>
      </p>
      <p className={style.formListItem}>
        <label className={style.label}>Description</label>
        <Text>{job.description}</Text>
      </p>
      <p className={style.formListItem}>
        <label className={style.label}>Role</label>
        <Text>{job.roleDescription}</Text>
      </p>
      <p className={style.formListItem}>
        <label className={style.label}>Created</label>
        <Text>{format(job.created, 'DD/MM/YYYY HH:mm:ss')}</Text>
      </p>
      <p className={style.formListItem}>
        <label className={style.label}>Modified</label>
        <Text>{format(job.modified, 'DD/MM/YYYY HH:mm:ss')}</Text>
      </p>
      <ul className={style.relations}>
        <Link to={`/referrals?job=${job.id}`} className={style.relationLink}>Referrals ({job.referrals.length})</Link>
        <Link to={`/intros?job=${job.id}`} className={style.relationLink}>Intros ({job.intros.length})</Link>
        <Link to={`/applications?job=${job.id}`} className={style.relationLink}>Applications ({job.applications.length})</Link>
      </ul>
    </Page>
  )
}

module.exports = View
