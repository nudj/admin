const React = require('react')
const { Link } = require('react-router-dom')
const get = require('lodash/get')
const { Helmet } = require('react-helmet')
const Autosuggest = require('react-autosuggest')
const isEmail = require('validator/lib/isEmail')
const differenceInMinutes = require('date-fns/difference_in_minutes')

const getStyle = require('./job-page.css')
const PageHeader = require('../page-header/page-header')
const RowItem = require('../row-item/row-item')
const CopyToClipboard = require('../copy-to-clipboard/copy-to-clipboard')
const { postData } = require('../../actions/app')

module.exports = class JobsPage extends React.Component {
  constructor (props) {
    super(props)
    this.style = getStyle()

    const value = ''
    const suggestions = get(props, 'people', [])

    this.state = {value, suggestions}
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
            <CopyToClipboard className={this.style.copyLink} data-clipboard-text={referralLink}>Copy link</CopyToClipboard>
          ]}
        />)
      })}
    </div>)
  }

  onChange (event, {newValue}) {
    this.setState({
      value: newValue
    })
  }

  onSuggestionsFetchRequested ({value}) {
    this.setState({
      suggestions: this.getSuggestions(value)
    })
  }

  onSuggestionsClearRequested () {
    this.setState({
      suggestions: []
    })
  }

  getSuggestions (value) {
    const matcher = new RegExp(`${value}`, 'i')
    const people = get(this.props, 'people', [])
    return people.filter(person => {
      const emailMatch = matcher.test(person.email)
      const firstNameMatch = matcher.test(person.firstName)
      const lastNameMatch = matcher.test(person.lastName)
      return emailMatch || firstNameMatch || lastNameMatch
    })
  }

  getSuggestionValue (suggestion) {
    return suggestion.email
  }

  getPersonFromEmail (email) {
    const suggestions = get(this.props, 'people', [])
    return suggestions.find(suggestion => suggestion.email === email)
  }

  renderSuggestion (suggestion) {
    return (<span className={this.style.suggestion}>{suggestion.email} - {suggestion.firstName} {suggestion.lastName}</span>)
  }

  renderInputComponent (inputProps) {
    return (<input {...inputProps} className={this.style.inputBox} />)
  }

  saveLink (event) {
    const companySlug = get(this.props, 'company.slug')
    const jobSlug = get(this.props, 'job.slug', '')

    const person = this.getPersonFromEmail(this.state.value)
    const personId = person.id

    const url = `/${companySlug}/jobs/${jobSlug}/referrals/${personId}`
    const method = 'post'
    const data = {}

    this.setState({
      value: ''
    }, () => this.props.dispatch(postData({ url, data, method })))
  }

  saveUser (event) {
    const companySlug = get(this.props, 'company.slug')
    const jobSlug = get(this.props, 'job.slug', '')
    const email = this.state.value.toString()

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

  render () {
    const applicationsList = this.renderApplicationsList()
    const referralsList = this.renderReferralsList()
    const jobActivity = this.renderJobActivities()

    const { value, suggestions } = this.state

    const autosuggestInputProps = {
      placeholder: 'Type a name or email',
      value: value,
      onChange: this.onChange.bind(this)
    }

    const companyName = get(this.props, 'company.name')
    const companySlug = get(this.props, 'company.slug')
    const jobTitle = get(this.props, 'job.title')

    const { button, info } = this.renderUserActions(value)

    return (
      <div className={this.style.pageBody}>
        <Helmet>
          <title>{`nudj - ${jobTitle} @ ${companyName}`}</title>
        </Helmet>
        <PageHeader
          title={jobTitle}
          subtitle={<span>@ <Link className={this.style.headerLink} to={`/${companySlug}/jobs`}>{companyName}</Link></span>}
        />
        <div className={this.style.pageContent}>
          <div className={this.style.pageMainContainer}>
            <h3 className={this.style.pageHeadline}>Job activity</h3>
            <div className={this.style.pageMain}>
              {jobActivity}
            </div>
            <hr className={this.style.sectionDivider} />
            <h3 className={this.style.pageHeadline}>Referrals</h3>
            <div className={this.style.pageMain}>
              {referralsList}
            </div>
            <h4 className={this.style.pageHeadline}>Add someone else</h4>
            <div className={this.style.pageMain}>
              <div className={this.style.missing}>
                <div className={this.style.missingGroup}>
                  <div className={this.style.inputBoxHole}>
                    <Autosuggest
                      className={this.style.inputBox}
                      suggestions={suggestions}
                      onSuggestionsFetchRequested={this.onSuggestionsFetchRequested.bind(this)}
                      onSuggestionsClearRequested={this.onSuggestionsClearRequested.bind(this)}
                      getSuggestionValue={this.getSuggestionValue.bind(this)}
                      renderSuggestion={this.renderSuggestion.bind(this)}
                      renderInputComponent={this.renderInputComponent.bind(this)}
                      inputProps={autosuggestInputProps} />
                  </div>
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
