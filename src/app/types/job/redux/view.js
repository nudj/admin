const React = require('react')
const { Helmet } = require('react-helmet')
const { Link } = require('react-router-dom')

const Page = require('../../../components/page')
const JobForm = require('../../../components/job-form')

const View = props => {
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
      <JobForm
        company={job.company}
        jobs={jobs}
        job={job}
        readOnly
      />
      <div><Link to={`/referrals?job=${job.id}`}>Referrals ({job.referrals.length})</Link></div>
      <div><Link to={`/intros?job=${job.id}`}>Intros ({job.intros.length})</Link></div>
      <div><Link to={`/applications?job=${job.id}`}>Applications ({job.applications.length})</Link></div>
    </Page>
  )
}

module.exports = View
