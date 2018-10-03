const React = require('react')
const get = require('lodash/get')
const { Helmet } = require('react-helmet')
const { Link } = require('react-router-dom')
const differenceInMinutes = require('date-fns/difference_in_minutes')
const actions = require('@nudj/framework/actions')

const getStyle = require('./style.css')
const Page = require('../../components/page')
const CopyToClipboard = require('../../components/copy-to-clipboard')
const Autocomplete = require('../../components/autocomplete')
const PersonForm = require('../../components/person-form')
const RowItem = require('../../components/row-item')
const Plural = require('../../components/plural')

module.exports = class PersonPage extends React.Component {
  constructor (props) {
    super(props)
    this.style = getStyle()
    const resetForm = false
    const resetReferral = false
    this.state = { resetForm, resetReferral }
  }

  componentWillReceiveProps (nextProps) {
    const resetForm = !!get(nextProps, 'savedPerson')
    const resetReferral = !!get(nextProps, 'referral')

    if (resetForm !== this.state.resetForm) {
      this.setState({ resetForm })
    }

    if (resetReferral !== this.state.resetReferral) {
      this.setState({ resetReferral }, () => {
        const resetReferral = false
        this.setState({ resetReferral })
      })
    }
  }

  findRelatedReferral (referralId) {
    const referrals = get(this.props, 'referrals', [])
    return referrals.find(referral => referral.parent === referralId)
  }

  findRelatedJob (jobId) {
    return get(this.props, 'expandedJobs', []).find(job => job.id === jobId)
  }

  generateReferralLink (referral) {
    const companySlug = get(referral, 'job.company.slug', '')
    const jobSlug = get(referral, 'job.slug', '')
    const webHostname = get(this.props, 'web.hostname')
    const link = `https://${webHostname}/companies/${companySlug}/jobs/${jobSlug}?referralId=${get(referral, 'id', '')}`
    return link
  }

  onSubmit (data) {
    const url = `/people/${data.id}`
    const method = 'put'

    this.props.dispatch(actions.app.postData({ url, data, method }))
  }

  renderReferralsList () {
    const referrals = get(this.props, 'referrals', [])

    if (!referrals.length) {
      return (<p className={this.style.copy}>💩 None here</p>)
    }

    const rightNow = new Date()

    return (<div>
      {referrals.map(referral => {
        const link = this.generateReferralLink(referral)
        const parent = get(referral, 'parent')
        const parentInfo = parent ? `${parent.id} (${parent.person.firstName} ${parent.person.lastName})` : '-'
        const companyName = get(referral, 'job.company.name', '')
        const companySlug = get(referral, 'job.company.slug', '')
        const jobSlug = get(referral, 'job.slug', '')
        const jobTitle = get(referral, 'job.title', '')
        const jobLink = `/companies/${companySlug}/jobs/${jobSlug}`
        const minutes = differenceInMinutes(rightNow, get(referral, 'created'))
        const rowClass = minutes < 10 ? 'rowHighlight' : 'row'
        const title = `${jobTitle} (${companyName})`

        return (<RowItem
          key={referral.id}
          rowClass={rowClass}
          title={title}
          uri={link}
          details={[
            {
              term: 'Referral Id',
              description: get(referral, 'id')
            },
            {
              term: 'Link',
              description: link
            },
            {
              term: 'Parent referral',
              description: parentInfo
            }
          ]}
          actions={[
            <Link className={this.style.nudj} to={jobLink}>See job</Link>,
            <CopyToClipboard className={this.style.copyLink} data-clipboard-text={link}>Copy link</CopyToClipboard>
          ]}
        />)
      })}
    </div>)
  }

  onChangeReferral (value, matches) {
    const referralJobId = matches.length === 1 ? get(matches[0], 'id') : ''
    this.setState({referralJobId})
  }

  saveLink (event) {
    const personId = get(this.props, 'person.id', '')

    const url = `/people/${personId}/referrals/${this.state.referralJobId}`
    const method = 'post'
    const data = {}

    this.setState({
      referralJobId: ''
    }, () => this.props.dispatch(actions.app.postData({ url, data, method })))
  }

  renderReferralActions (jobId) {
    let button = (<span />)
    let info = (<span />)

    if (!jobId) {
      return { button, info }
    }
    const existingReferral = get(this.props, 'referrals', []).find(referral => referral.job.id === jobId)
    const job = get(this.props, 'jobs', []).find(job => job.id === jobId)

    // Does this person already have a referral for this job?
    if (existingReferral) {
      const link = this.generateReferralLink({
        ...existingReferral,
        job
      })
      button = (<CopyToClipboard className={this.style.copyLinkNew} data-clipboard-text={link}>Copy link</CopyToClipboard>)
      info = (<p className={this.style.copy}>This person&apos;s already had a referreral for this job 💅🏼 It should be in the referrals list above ⬆️ <br />Their referral link is <a href={link} className={this.style.link}>{link}</a>.</p>)
    } else if (job) {
      button = (<button className={this.style.copyLinkNew} onClick={this.saveLink.bind(this)}>Generate referral link</button>)
      info = (<p className={this.style.copy}>That&apos;s a job! 😎 Click the button above to generate a referral link 💅🏼</p>)
    }

    return { button, info }
  }

  simpleJobsList () {
    return get(this.props, 'jobs', []).map(job => {
      const jobTitle = get(job, 'title')
      const companyName = get(job, 'company.name')
      const value = `${companyName} - ${jobTitle}`
      const id = get(job, 'id')
      return {id, value}
    })
  }

  renderReferralAdder () {
    const placeholder = 'Type a company name or job title'
    const referralJobs = this.simpleJobsList()

    const { referralJobId } = this.state
    const { button, info } = this.renderReferralActions(referralJobId)

    return (<div className={this.style.missing}>
      <div className={this.style.missingGroup}>
        <Autocomplete
          placeholder={placeholder}
          suggestions={referralJobs}
          reset={this.state.resetReferral}
          onChange={this.onChangeReferral.bind(this)} />
        {button}
      </div>
      {info}
    </div>)
  }

  render () {
    const people = get(this.props, 'people', [])
    const person = get(this.props, 'person', {})
    const hirer = get(person, 'hirer', {})

    const personName = `${get(person, 'firstName', '')} ${get(person, 'lastName', '')}`

    const editPersonForm = (
      <PersonForm
        people={people}
        person={person}
        hirer={hirer}
        reset={this.state.resetForm}
        onSubmit={this.onSubmit.bind(this)}
        submitLabel='Save changes'
      />
    )

    const referralsList = this.renderReferralsList()
    const referralsAdder = this.renderReferralAdder()

    return (
      <Page
        {...this.props}
        title={personName}
        actions={<h4>{get(this.props, 'person.email')}</h4>}
      >
        <Helmet>
          <title>{`ADMIN - ${personName}`}</title>
        </Helmet>
        <div className={this.style.pageContent}>
          <div className={this.style.pageMainContainer}>
            <h3 className={this.style.pageHeadline}>Edit person details</h3>
            {editPersonForm}
            <hr className={this.style.sectionDivider} />
            <h3 className={this.style.pageHeadline}>Referrals</h3>
            <div className={this.style.pageMain}>
              {referralsList}
            </div>
            <h4 className={this.style.pageHeadline}>Add <Plural zero='a' singular='another' count={get(this.props, 'referrals', []).length} /> referral</h4>
            <div className={this.style.pageMain}>
              {referralsAdder}
            </div>
          </div>
        </div>
      </Page>
    )
  }
}
