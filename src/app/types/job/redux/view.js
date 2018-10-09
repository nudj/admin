const React = require('react')
const { Helmet } = require('react-helmet')
const { Link } = require('react-router-dom')

const Page = require('../../../components/page')
const JobForm = require('../../../components/job-form')
const getStyle = require('../../../lib/item/style.css')

const View = props => {
  const style = getStyle()
  const { app: { job = {}, jobs = [] } } = props
  return (
    <Page
      {...props}
      title={job.title}
      description={`@ ${job.company.name}`}
    >
      <Helmet>
        <title>{`ADMIN - ${job.title}`}</title>
      </Helmet>
      <ul className={style.relations}>
        <Link to={`/referrals?job=${job.id}`} className={style.relationLink}>Referrals ({job.referrals.length})</Link>
        <Link to={`/intros?job=${job.id}`} className={style.relationLink}>Intros ({job.intros.length})</Link>
        <Link to={`/applications?job=${job.id}`} className={style.relationLink}>Applications ({job.applications.length})</Link>
      </ul>
      <JobForm
        company={job.company}
        jobs={jobs}
        job={job}
        readOnly
      />
    </Page>
  )
}

module.exports = View
