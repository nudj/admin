const React = require('react')
const { Link } = require('react-router-dom')
const get = require('lodash/get')
const omit = require('lodash/omit')
const { Helmet } = require('react-helmet')
const isEmail = require('validator/lib/isEmail')
const differenceInMinutes = require('date-fns/difference_in_minutes')
const actions = require('@nudj/framework/actions')
const { getJobUrl } = require('@nudj/library')

const getStyle = require('./style.css')
const Page = require('../../components/page')
const Autocomplete = require('../../components/autocomplete')
const RowItem = require('../../components/row-item')
const CopyToClipboard = require('../../components/copy-to-clipboard')
const JobForm = require('../../components/job-form')

module.exports = class JobPage extends React.Component {
  constructor (props) {
    super(props)
    this.style = getStyle()

    const referralValue = ''
    const resetReferral = false

    this.state = {referralValue, resetReferral}
  }

  componentWillReceiveProps (nextProps) {
    const resetReferral = !!get(nextProps, 'company.job.referral')

    if (resetReferral === this.state.resetReferral) {
      return
    }

    if (!resetReferral) {
      return this.setState({ resetReferral })
    }

    const referralValue = ''
    this.setState({ referralValue, resetReferral }, () => {
      const resetReferral = false
      this.setState({ resetReferral })
    })
  }

  renderJobActivitiy (activity) {
    let trendStyle = this.style.jobActivityHighlightPositive

    if (activity.trend === -1) {
      trendStyle = this.style.jobActivityHighlightNegative
    } else if (activity.trend === 0) {
      trendStyle = this.style.jobActivityHighlightNeutral
    }

    return (<div className={this.style.jobActivity}>
      <h4 className={this.style.jobActivityTitle}>{activity.title}</h4>
      <p className={this.style.jobActivitySummary}><span className={trendStyle}>{activity.thisWeek}</span> in the last week</p>
      <p className={this.style.jobActivityFooter}>{activity.total} in total</p>
    </div>)
  }

  getActivityData (title, data) {
    const activityData = {
      title: title,
      thisWeek: data.thisWeek,
      total: data.total,
      trend: data.trend
    }
    return activityData
  }

  getActivitesData () {
    const pageViewData = get(this.props.app, 'activities.pageViews', {})
    const referrerData = get(this.props.app, 'activities.referrers', {})
    const applicationData = get(this.props.app, 'activities.applications', {})

    const pageViews = this.getActivityData('Page views', pageViewData)
    const referrers = this.getActivityData('Referrers', referrerData)
    const applications = this.getActivityData('Applications', applicationData)

    return {pageViews, referrers, applications}
  }

  renderJobActivities () {
    const {referrers, applications} = this.getActivitesData()

    return (<div className={this.style.jobActivities}>
      {this.renderJobActivitiy(referrers)}
      {this.renderJobActivitiy(applications)}
    </div>)
  }

  findParentReferral (referralId) {
    const referrals = get(this.props.app, 'company.job.referrals', [])
    return referrals.find(referral => referral.id === referralId)
  }

  renderApplicationsList () {
    const applications = get(this.props.app, 'company.job.applications', [])

    if (!applications.length) {
      return (<p className={this.style.copy}>💩 No one here</p>)
    }

    return (<div>
      {applications.map(application => {
        const name = `${get(application, 'person.firstName')} ${get(application, 'person.lastName')}`
        const referralId = get(application, 'referral.id')
        const personLink = `/people/${get(application, 'person.id')}`
        const parentReferral = this.findParentReferral(referralId)
        const referralPerson = get(parentReferral, 'person', {})
        const parentReferralInfo = parentReferral ? `${parentReferral.id} (${referralPerson.firstName} ${referralPerson.lastName})` : '-'
        return (<RowItem
          key={`application${get(application, 'id')}`}
          title={name}
          details={[
            {
              term: 'Email',
              description: get(application, 'person.email')
            },
            {
              term: 'Referral',
              description: parentReferralInfo
            }
          ]}
          actions={[
            <Link className={this.style.nudjLink} to={personLink}>See person</Link>
          ]}
        />)
      })}
    </div>)
  }

  generateReferralLink (referral) {
    const company = get(this.props.app, 'company.slug')
    const job = get(this.props.app, 'company.job.slug', '')
    referral = get(referral, 'slug', '')
    const hostname = get(this.props, 'web.hostname')
    return getJobUrl({
      hostname,
      company,
      job,
      referral
    })
  }

  renderReferralsList () {
    const referrals = get(this.props.app, 'company.job.referrals', [])
    const newReferral = get(this.props.app, 'company.job.referral')
    const allReferrals = newReferral ? referrals.concat(newReferral) : referrals

    if (!allReferrals.length) {
      return (<p className={this.style.copy}>💩 No one here</p>)
    }

    const companySlug = get(this.props.app, 'company.slug')
    const jobSlug = get(this.props.app, 'company.job.slug', '')
    const rightNow = new Date()

    return (<div>
      {allReferrals.map(referral => {
        const person = get(referral, 'person', {})
        const name = `${person.firstName || '-'} ${person.lastName || '-'}`
        const slug = `${companySlug}+${jobSlug}+${get(referral, 'slug', '')}`
        const parentId = get(referral, 'parent.id')
        const parentReferral = this.findParentReferral(parentId)
        const referralLink = this.generateReferralLink(referral)
        const personLink = `/people/${get(referral, 'person.id')}`

        const minutes = differenceInMinutes(rightNow, get(referral, 'created'))
        const rowClass = minutes < 10 ? 'rowHighlight' : 'row'

        const referralPerson = get(parentReferral, 'person', {})
        const parentReferralInfo = parentReferral ? `${parentReferral.id} (${referralPerson.firstName} ${referralPerson.lastName})` : '-'

        return (<RowItem
          key={slug}
          rowClass={rowClass}
          title={name}
          uri={referralLink}
          details={[
            {
              term: 'Referral Id',
              description: get(referral, 'id')
            },
            {
              term: 'Email',
              description: get(referral, 'person.email')
            },
            {
              term: 'Link',
              description: referralLink
            },
            {
              term: 'Parent referral',
              description: parentReferralInfo
            }
          ]}
          actions={[
            <Link className={this.style.nudjLink} to={personLink}>See person</Link>,
            <CopyToClipboard className={this.style.copyLink} data-clipboard-text={referralLink}>Copy link</CopyToClipboard>
          ]}
        />)
      })}
    </div>)
  }

  onChangeReferral (value, matches) {
    let referralValue = value
    if (!isEmail(referralValue) && matches.length === 1) {
      // in this case 'id' is the email as put together in `render`
      const email = get(matches[0], 'id', '')
      referralValue = value.indexOf(email) === 0 ? email : referralValue
    }
    this.setState({referralValue})
  }

  onSubmitJob (jobData) {
    const data = omit(jobData, ['created', 'applications', 'referrals'])
    const companySlug = get(this.props.app, 'company.slug')
    const jobSlug = get(this.props.app, 'company.job.slug')
    const url = `/companies/${companySlug}/jobs/${jobSlug}`
    const method = 'put'

    this.props.dispatch(actions.app.postData({ url, data, method }))
  }

  saveReferral (event) {
    const companySlug = get(this.props.app, 'company.slug')
    const jobSlug = get(this.props.app, 'company.job.slug', '')
    const email = this.state.referralValue.toString()

    const url = `/companies/${companySlug}/jobs/${jobSlug}/referrals`
    const method = 'post'
    const data = { email }

    this.setState({
      value: ''
    }, () => this.props.dispatch(actions.app.postData({ url, data, method })))
  }

  renderUserActions (value) {
    const referrals = get(this.props.app, 'company.job.referrals', [])
    const people = get(this.props.app, 'people', [])

    let button = (<span />)
    let info = (<span />)

    // Check is value an email,
    if (!value || !isEmail(value)) {
      return { button, info }
    }

    const referral = referrals.find(referral => get(referral, 'person.email') === value)
    const existingPerson = people.find(person => person.email === value)

    // if so is it already in the referrals?
    if (referral) {
      const referralLink = this.generateReferralLink(referral)
      button = (<CopyToClipboard className={this.style.copyLinkNew} data-clipboard-text={referralLink}>Copy link</CopyToClipboard>)
      info = (<p className={this.style.copy}>This person&#39;s already had a referreral for this job 💅🏼 They should be in the referrals list above ⬆️ <br />Their referral link is <a href={referralLink} className={this.style.link}>{referralLink}</a>.</p>)
    } else if (existingPerson) {
      //  if so make the referral
      button = (<button className={this.style.copyLinkNew} onClick={this.saveReferral.bind(this)}>Generate referral link</button>)
      info = (<p className={this.style.copy}>This person&#39;s already in our database 😎 Click the button above to generate a referral link for them 💅🏼</p>)
    } else {
      button = (<button className={this.style.copyLinkNew} onClick={this.saveReferral.bind(this)}>Save as a user and generate referral link</button>)
      info = (<p className={this.style.copy}>Got no idea who this is 🤷‍ Click the button above to save them as a user and generate a referral link you can copy 💅🏼</p>)
    }

    return { button, info }
  }

  renderJobActivitiyGroup () {
    const jobStatus = get(this.props.app, 'company.job.status')

    if (jobStatus !== 'PUBLISHED') {
      return (<span />)
    }

    const jobActivity = this.renderJobActivities()
    return (<div>
      <h3 className={this.style.pageHeadline}>Job activity</h3>
      <div className={this.style.pageMain}>
        {jobActivity}
      </div>
    </div>)
  }

  render () {
    const applicationsList = this.renderApplicationsList()
    const referralsList = this.renderReferralsList()

    const jobActivityGroup = this.renderJobActivitiyGroup()

    const { referralValue, resetReferral } = this.state

    const placeholder = 'Type a name or email'
    const suggestions = get(this.props.app, 'people', []).map(person => {
      const id = person.email
      const value = `${person.email} - ${person.firstName} ${person.lastName}`
      return { id, value }
    })

    const company = get(this.props.app, 'company')

    const companyName = get(company, 'name')
    const companySlug = get(company, 'slug')
    const jobTitle = get(company, 'job.title')

    const { button, info } = this.renderUserActions(referralValue)

    const job = get(this.props.app, 'company.job', {})
    const jobs = get(this.props.app, 'jobs', [])
    const templateTags = get(this.props.app, 'jobTemplateTags', [])

    const editJobForm = (<JobForm
      company={company}
      jobs={jobs}
      job={job}
      templateTags={templateTags}
      reset={this.state.resetJobForm}
      onSubmit={this.onSubmitJob.bind(this)}
      submitLabel='Save changes' />)

    return (
      <Page
        {...this.props}
        title={jobTitle}
        description={(
          <span>
            @{' '}
            <Link
              className={this.style.headerLink}
              to={`/companies/${companySlug}`}
            >
              {companyName}
            </Link>
          </span>
        )}
        actions={<h4>{get(this.props, 'job.status')}</h4>}
      >
        <Helmet>
          <title>{`ADMIN - ${jobTitle} @ ${companyName}`}</title>
        </Helmet>
        <div className={this.style.pageContent}>
          <div className={this.style.pageMainContainer}>
            {jobActivityGroup}
            <h3 className={this.style.pageHeadline}>Edit job details</h3>
            {editJobForm}
            <hr className={this.style.sectionDivider} />
            <h3 className={this.style.pageHeadline}>Referrals</h3>
            <div className={this.style.pageMain}>
              {referralsList}
            </div>
            <h4 className={this.style.pageHeadline}>Add someone else</h4>
            <div className={this.style.pageMain}>
              <div className={this.style.missing}>
                <div className={this.style.missingGroup}>
                  <Autocomplete
                    placeholder={placeholder}
                    suggestions={suggestions}
                    reset={resetReferral}
                    onChange={this.onChangeReferral.bind(this)} />
                  {button}
                </div>
                {info}
              </div>
            </div>
            <hr className={this.style.sectionDivider} />
            <h3 className={this.style.pageHeadline}>Applications</h3>
            <div className={this.style.pageMain}>
              {applicationsList}
            </div>
          </div>
        </div>
      </Page>
    )
  }
}
