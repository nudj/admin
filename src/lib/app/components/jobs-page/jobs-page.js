const React = require('react')
const { Link } = require('react-router-dom')
const get = require('lodash/get')
const format = require('date-fns/format')
const differenceInMinutes = require('date-fns/difference_in_minutes')
const { Helmet } = require('react-helmet')
const getStyle = require('./jobs-page.css')
const PageHeader = require('../page-header/page-header')
const RowItem = require('../row-item/row-item')
const Tooltip = require('../tooltip/tooltip')
const CompanyForm = require('../company-form/company-form')
const JobForm = require('../job-form/job-form')
const { postData } = require('../../actions/app')

module.exports = class JobsPage extends React.Component {
  constructor (props) {
    super(props)
    this.style = getStyle()
    const resetCompanyForm = false
    const resetJobForm = false
    this.state = { resetCompanyForm, resetJobForm }
  }

  componentWillReceiveProps (nextProps) {
    const resetCompanyForm = !!get(nextProps, 'savedCompany')
    const resetJobForm = !!get(nextProps, 'newJob')

    if (resetCompanyForm && resetCompanyForm !== this.state.resetCompanyForm) {
      this.setState({ resetCompanyForm })
    }

    if (resetJobForm && resetJobForm !== this.state.resetJobForm) {
      this.setState({ resetJobForm })
    }
  }

  onSubmitJob (data) {
    const companySlug = get(this.props, 'company.slug')

    const url = `/${companySlug}/jobs`
    const method = 'post'

    this.props.dispatch(postData({ url, data, method }))
  }

  onSubmitCompanyChanges (data) {
    const companySlug = data.slug
    const url = `/${companySlug}`
    const method = 'put'

    this.props.dispatch(postData({ url, data, method }))
  }

  renderJobsList () {
    const jobs = get(this.props, 'jobs', [])
    const companySlug = get(this.props, 'company.slug')
    const rightNow = new Date()

    const jobsList = jobs.map((job) => {
      const jobBonus = get(job, 'bonus')
      const jobCreatedDate = format(get(job, 'created'), 'DD.MM.YYYY')
      const jobLocation = get(job, 'location')
      const jobSlug = get(job, 'slug')
      const jobStatus = get(job, 'status')
      const jobTitle = get(job, 'title')

      const minutes = differenceInMinutes(rightNow, get(job, 'created'))
      const rowClass = minutes < 10 ? 'rowHighlight' : 'row'

      return (<RowItem
        key={jobSlug}
        rowClass={rowClass}
        title={jobTitle}
        uri={`//nudj.co/jobs/${jobSlug}+${jobSlug}`}
        details={[{
          term: 'Status',
          description: jobStatus
        }, {
          term: 'Location',
          description: jobLocation
        }, {
          term: 'Added',
          description: jobCreatedDate
        }, {
          term: 'Bonus',
          description: `£${jobBonus}`
        }]}
        actions={[
          <Link className={this.style.nudj} to={`/${companySlug}/jobs/${jobSlug}`}>See job</Link>
        ]}
      />)
    })

    return (<ul className={this.style.jobs}>
      {jobsList}
    </ul>)
  }

  render () {
    const jobs = get(this.props, 'jobs', [])
    const companies = get(this.props, 'companies', [])
    const company = get(this.props, 'company', {})
    const tooltip = get(this.props, 'tooltip')

    const companyName = get(company, 'name')

    const editCompanyForm = (<CompanyForm
      companies={companies}
      company={company}
      reset={this.state.resetCompanyForm}
      onSubmit={this.onSubmitCompanyChanges.bind(this)}
      submitLabel='Save changes' />)

    const jobsList = this.renderJobsList()

    const addJobForm = (<JobForm
      jobs={jobs}
      reset={this.state.resetJobForm}
      onSubmit={this.onSubmitJob.bind(this)}
      submitLabel='Add job' />)

    const publishedJobs = jobs.filter(job => job.status === 'Published')

    return (
      <div className={this.style.pageBody}>
        <Helmet>
          <title>{`nudj - ${companyName}`}</title>
        </Helmet>
        <PageHeader title={companyName} subtitle={`Jobs and Hirers`} />
        <h3 className={this.style.pageHeadline}>
          <span className={this.style.pageHeadlineHighlight}>{companyName}</span>
        </h3>
        <div className={this.style.pageContent}>
          {editCompanyForm}
          <div className={this.style.pageSidebar} />
        </div>
        <h3 className={this.style.pageHeadline}>
          Jobs: published <span className={this.style.pageHeadlineHighlight}>({publishedJobs.length})</span> / total <span className={this.style.pageHeadlineHighlight}>({jobs.length})</span>
        </h3>
        <div className={this.style.pageContent}>
          <div className={this.style.pageMain}>
            {jobsList}
          </div>
          <div className={this.style.pageSidebar}>
            {tooltip ? <Tooltip {...tooltip} /> : ''}
          </div>
        </div>
        <h4 className={this.style.pageHeadline}>Add another job</h4>
        <div className={this.style.pageContent}>
          {addJobForm}
          <div className={this.style.pageSidebar} />
        </div>
      </div>
    )
  }
}
