const React = require('react')
const { Link } = require('react-router-dom')
const get = require('lodash/get')
const { Helmet } = require('react-helmet')
const isEmail = require('validator/lib/isEmail')
const differenceInMinutes = require('date-fns/difference_in_minutes')

const getStyle = require('./job-page.css')
const Autocomplete = require('../autocomplete/autocomplete')
const PageHeader = require('../page-header/page-header')
const RowItem = require('../row-item/row-item')
const CopyToClipboard = require('../copy-to-clipboard/copy-to-clipboard')
const JobForm = require('../job-form/job-form')
const { postData } = require('../../actions/app')

module.exports = class JobsPage extends React.Component {
  constructor (props) {
    super(props)
    this.style = getStyle()

    const referralValue = ''
    const resetReferral = false

    this.state = {referralValue, resetReferral}
  }

  componentWillReceiveProps (nextProps) {
    const resetReferral = !!get(nextProps, 'referral')

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
    const pageViewData = get(this.props, 'activities.pageViews', {})
    const referrerData = get(this.props, 'activities.referrers', {})
    const applicationData = get(this.props, 'activities.applications', {})

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

  findRelatedReferral (referralId) {
    const referrals = get(this.props, 'referrals', [])
    return referrals.find(referral => referral.id === referralId)
  }

  renderApplicationsList () {
    const applications = get(this.props, 'applications', [])

    if (!applications.length) {
      return (<p className={this.style.copy}>💩 No one here</p>)
    }

    return (<div>
      {applications.map(application => {
        const name = `${get(application, 'firstName')} ${get(application, 'lastName')}`
        const referralId = get(application, 'referralId')
        const relatedReferral = this.findRelatedReferral(referralId)
        const relatedReferralInfo = relatedReferral ? `${relatedReferral.id} (${relatedReferral.firstName} ${relatedReferral.lastName})` : '-'
        return (<RowItem
          title={name}
          details={[
            {
              term: 'Email',
              description: get(application, 'email')
            },
            {
              term: 'Referral',
              description: relatedReferralInfo
            }
          ]}
        />)
      })}
    </div>)
  }

  generateReferralLink (referral) {
    const companySlug = get(this.props, 'company.slug')
    const jobSlug = get(this.props, 'job.slug', '')
    const slug = `${companySlug}+${jobSlug}+${get(referral, 'id', '')}`
    const referralLink = `https://nudj.co/jobs/${slug}`
    return referralLink
  }

  renderReferralsList () {
    const referrals = get(this.props, 'referrals', [])

    if (!referrals.length) {
      return (<p className={this.style.copy}>💩 No one here</p>)
    }

    const companySlug = get(this.props, 'company.slug')
    const jobSlug = get(this.props, 'job.slug', '')
    const rightNow = new Date()

    return (<div>
      {referrals.map(referral => {
        const name = `${get(referral, 'firstName', '-')} ${get(referral, 'lastName', '-')}`
        const slug = `${companySlug}+${jobSlug}+${get(referral, 'id', '')}`
        const referralId = get(referral, 'referralId')
        const relatedReferral = this.findRelatedReferral(referralId)
        const referralLink = this.generateReferralLink(referral)
        const personLink = `/people/${referral.personId}`

        const minutes = differenceInMinutes(rightNow, get(referral, 'created'))
        const rowClass = minutes < 10 ? 'rowHighlight' : 'row'

        const relatedReferralInfo = relatedReferral ? `${relatedReferral.id} (${relatedReferral.firstName} ${relatedReferral.lastName})` : '-'

        return (<RowItem
          rowKey={slug}
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
              description: get(referral, 'email')
            },
            {
              term: 'Link',
              description: referralLink
            },
            {
              term: 'Related referral',
              description: relatedReferralInfo
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

  onSubmitJob (data) {
    const companySlug = get(this.props, 'company.slug')
    const jobSlug = get(this.props, 'job.slug')
    const url = `/${companySlug}/jobs/${jobSlug}`
    const method = 'put'

    this.props.dispatch(postData({ url, data, method }))
  }

  getPersonFromEmail (email) {
    const suggestions = get(this.props, 'people', [])
    return suggestions.find(suggestion => suggestion.email === email)
  }

  saveLink (event) {
    const companySlug = get(this.props, 'company.slug')
    const jobSlug = get(this.props, 'job.slug', '')

    const person = this.getPersonFromEmail(this.state.referralValue)
    const personId = person.id

    const url = `/${companySlug}/jobs/${jobSlug}/referrals/${personId}`
    const method = 'post'
    const data = {}

    this.setState({
      referralValue: ''
    }, () => this.props.dispatch(postData({ url, data, method })))
  }

  saveUser (event) {
    const companySlug = get(this.props, 'company.slug')
    const jobSlug = get(this.props, 'job.slug', '')
    const email = this.state.referralValue.toString()

    const url = `/${companySlug}/jobs/${jobSlug}/referrals`
    const method = 'post'
    const data = {email}

    this.setState({
      value: ''
    }, () => this.props.dispatch(postData({ url, data, method })))
  }

  renderUserActions (value) {
    const referrals = get(this.props, 'referrals', [])
    const people = get(this.props, 'people', [])

    let button = (<span />)
    let info = (<span />)

    // Check is value an email,
    if (!value || !isEmail(value)) {
      return { button, info }
    }

    const referral = referrals.find(referral => referral.email === value)
    const existingPerson = people.find(person => person.email === value)

    // if so is it already in the referrals?
    if (referral) {
      const referralLink = this.generateReferralLink(referral)
      button = (<CopyToClipboard className={this.style.copyLinkNew} data-clipboard-text={referralLink}>Copy link</CopyToClipboard>)
      info = (<p className={this.style.copy}>This person's already had a referreral for this job 💅🏼 They should be in the referrals list above ⬆️ <br />Their referral link is <a href={referralLink} className={this.style.link}>{referralLink}</a>.</p>)
    } else if (existingPerson) {
      //  if so make the referral
      button = (<button className={this.style.copyLinkNew} onClick={this.saveLink.bind(this)}>Generate referral link</button>)
      info = (<p className={this.style.copy}>This person's already in our database 😎 Click the button above to generate a referral link for them 💅🏼</p>)
    } else {
      button = (<button className={this.style.copyLinkNew} onClick={this.saveUser.bind(this)}>Save as a user and generate referral link</button>)
      info = (<p className={this.style.copy}>Got no idea who this is 🤷‍ Click the button above to save them as a user and generate a referral link you can copy 💅🏼</p>)
    }

    return { button, info }
  }

  renderJobActivitiyGroup () {
    const jobStatus = get(this.props, 'job.status')

    if (jobStatus !== 'Published') {
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
    const suggestions = get(this.props, 'people', []).map(person => {
      const id = person.email
      const value = `${person.email} - ${person.firstName} ${person.lastName}`
      return { id, value }
    })

    const companyName = get(this.props, 'company.name')
    const companySlug = get(this.props, 'company.slug')
    const jobTitle = get(this.props, 'job.title')

    const { button, info } = this.renderUserActions(referralValue)

    const job = get(this.props, 'job', {})
    const jobs = get(this.props, 'jobs', [])

    const editJobForm = (<JobForm
      jobs={jobs}
      job={job}
      reset={this.state.resetJobForm}
      onSubmit={this.onSubmitJob.bind(this)}
      submitLabel='Save changes' />)

    return (
      <div className={this.style.pageBody}>
        <Helmet>
          <title>{`nudj - ${jobTitle} @ ${companyName}`}</title>
        </Helmet>
        <PageHeader
          title={jobTitle}
          subtitle={<span>@ <Link className={this.style.headerLink} to={`/${companySlug}/jobs`}>{companyName}</Link></span>}>
          <h4>{get(this.props, 'job.status')}</h4>
        </PageHeader>
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
      </div>
    )
  }
}
