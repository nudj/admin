const React = require('react')
const get = require('lodash/get')
const { Helmet } = require('react-helmet')
const { Link } = require('react-router-dom')
const differenceInMinutes = require('date-fns/difference_in_minutes')

const getStyle = require('./person-page.css')
const Page = require('../../components/page')
const CopyToClipboard = require('../../components/copy-to-clipboard')
const Autocomplete = require('../../components/autocomplete')
const PageHeader = require('../../components/page-header')
const PersonForm = require('../../components/person-form')
const RowItem = require('../../components/row-item')
const Plural = require('../../components/plural')
const TasksList = require('../../components/tasks-list')
const TaskAdder = require('../../components/task-adder')
const { postData } = require('../../../framework/redux/actions/app')

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
    const resetRecommendation = !!get(nextProps, 'recommendation')

    if (resetForm !== this.state.resetForm) {
      this.setState({ resetForm })
    }

    if (resetReferral !== this.state.resetReferral) {
      this.setState({ resetReferral }, () => {
        const resetReferral = false
        this.setState({ resetReferral })
      })
    }

    if (resetRecommendation !== this.state.resetRecommendation) {
      this.setState({ resetRecommendation }, () => {
        const resetRecommendation = false
        this.setState({ resetRecommendation })
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

  generateReferralLink (referral, expandedJob) {
    const companySlug = get(expandedJob, 'company.slug', '')
    const jobSlug = get(expandedJob, 'slug', '')
    const slug = `${companySlug}+${jobSlug}+${get(referral, 'id', '')}`
    const webHostname = get(this.props, 'web.hostname')
    const link = `https://${webHostname}/jobs/${slug}`
    return { link, slug }
  }

  onSubmit (data) {
    const url = `/people/${data.id}`
    const method = 'put'

    this.props.dispatch(postData({ url, data, method }))
  }

  onAddTask (task) {
    const personId = get(this.props, 'person.id', '')
    const taskType = get(task, 'type', '')
    const url = `/people/${personId}/tasks/${taskType}`
    const data = {}
    const method = 'post'

    this.props.dispatch(postData({ url, data, method }))
  }

  renderReferralsList () {
    const referrals = get(this.props, 'referrals', [])

    if (!referrals.length) {
      return (<p className={this.style.copy}>💩 None here</p>)
    }

    const rightNow = new Date()

    return (<div>
      {referrals.map(referral => {
        const parent = get(referral, 'parent', '')
        const relatedReferral = this.findRelatedReferral(parent)

        const job = get(referral, 'job')
        const relatedJob = this.findRelatedJob(job)

        const {link, slug} = this.generateReferralLink(referral, relatedJob)

        const relatedReferralInfo = relatedReferral ? `${relatedReferral.id} (${relatedReferral.firstName} ${relatedReferral.lastName})` : '-'

        const companyName = get(relatedJob, 'company.name', '')
        const companySlug = get(relatedJob, 'company.slug', '')
        const jobSlug = get(relatedJob, 'slug', '')
        const jobTitle = get(relatedJob, 'title', '')

        const jobLink = `/${companySlug}/jobs/${jobSlug}`

        const minutes = differenceInMinutes(rightNow, get(referral, 'created'))
        const rowClass = minutes < 10 ? 'rowHighlight' : 'row'

        const title = `${jobTitle} (${companyName})`

        return (<RowItem
          key={slug}
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
              term: 'Related referral',
              description: relatedReferralInfo
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

  renderRecommendationsList () {
    const recommendations = get(this.props, 'recommendations', [])

    if (!recommendations.length) {
      return (<p className={this.style.copy}>💩 None here</p>)
    }

    const rightNow = new Date()

    return (<div>
      {recommendations.map(recommendation => {
        const job = get(recommendation, 'job')
        const relatedJob = this.findRelatedJob(job)

        const companyName = get(relatedJob, 'company.name', '')
        const companySlug = get(relatedJob, 'company.slug', '')

        const jobSlug = get(relatedJob, 'slug', '')
        const jobTitle = get(relatedJob, 'title', '')

        const jobLink = `/${companySlug}/jobs/${jobSlug}`

        const hirerId = get(recommendation, 'hirer')
        const hirer = get(this.props, 'hirers', []).find(hirer => hirer.id === hirerId)
        const person = get(this.props, 'people', []).find(person => person.id === hirer.person)
        const hirerName = `${get(person, 'firstName')} ${get(person, 'lastName')}`

        const minutes = differenceInMinutes(rightNow, get(recommendation, 'created'))
        const rowClass = minutes < 10 ? 'rowHighlight' : 'row'

        const title = `${jobTitle} (${companyName})`
        const key = `${companySlug}+${jobSlug}`

        return (<RowItem
          key={key}
          rowClass={rowClass}
          title={title}
          details={[
            {
              term: 'Hirer',
              description: hirerName
            }
          ]}
          actions={[
            <Link className={this.style.nudj} to={jobLink}>See job</Link>
          ]}
        />)
      })}
    </div>)
  }

  onChangeRecommendation (value, matches) {
    const recommendationJobId = matches.length === 1 ? get(matches[0], 'id') : ''
    this.setState({recommendationJobId})
  }

  onChangeRecommendationHirer (event) {
    event.preventDefault()
    const recommendationHirerId = event.target.value
    this.setState({recommendationHirerId})
  }

  onChangeReferral (value, matches) {
    const referralJobId = matches.length === 1 ? get(matches[0], 'id') : ''
    this.setState({referralJobId})
  }

  saveLink (event) {
    const job = this.findRelatedJob(this.state.referralJobId)
    const jobSlug = get(job, 'slug', '')
    const personId = get(this.props, 'person.id', '')

    const url = `/people/${personId}/referrals/${jobSlug}`
    const method = 'post'
    const data = {}

    this.setState({
      referralJobId: ''
    }, () => this.props.dispatch(postData({ url, data, method })))
  }

  saveRecommendation (event) {
    const { recommendationJobId, recommendationHirerId } = this.state
    const job = this.findRelatedJob(recommendationJobId)
    const jobSlug = get(job, 'slug', '')
    const personId = get(this.props, 'person.id', '')

    const url = `/people/${personId}/recommendations/${jobSlug}`
    const method = 'post'
    const data = {
      hirer: recommendationHirerId
    }

    this.setState({
      recommendationJobId: '',
      recommendationHirerId: ''
    }, () => this.props.dispatch(postData({ url, data, method })))
  }

  renderReferralActions (referralJobId) {
    let button = (<span />)
    let info = (<span />)

    if (!referralJobId) {
      return { button, info }
    }

    const referral = get(this.props, 'referrals', []).find(referral => referral.job === referralJobId)
    const existingJob = get(this.props, 'expandedJobs', []).find(job => job.id === referralJobId)

    // Does this person already have a referral for this job?
    if (referral) {
      const {link} = this.generateReferralLink(referral, existingJob)
      button = (<CopyToClipboard className={this.style.copyLinkNew} data-clipboard-text={link}>Copy link</CopyToClipboard>)
      info = (<p className={this.style.copy}>This person's already had a referreral for this job 💅🏼 It should be in the referrals list above ⬆️ <br />Their referral link is <a href={link} className={this.style.link}>{link}</a>.</p>)
    } else if (existingJob) {
      button = (<button className={this.style.copyLinkNew} onClick={this.saveLink.bind(this)}>Generate referral link</button>)
      info = (<p className={this.style.copy}>That's a job! 😎 Click the button above to generate a referral link 💅🏼</p>)
    }

    return { button, info }
  }

  renderRecommendationActions (recommendationJobId, recommendationHirerId) {
    let button = (<span />)
    let info = (<span />)

    if (!recommendationJobId || !recommendationHirerId) {
      return { button, info }
    }

    const recommendation = get(this.props, 'recommendations', []).find(recommendation => {
      return recommendation.job === recommendationJobId && recommendation.hirer === recommendationHirerId
    })
    const existingJob = get(this.props, 'expandedJobs', []).find(job => job.id === recommendationJobId)

    // Does this person already have a recommendation for this job?
    if (recommendation) {
      info = (<p className={this.style.copy}>This person's already had a recommendation created for this job with that person 💅🏼 It should be in the recommendations list above ⬆️.</p>)
    } else if (existingJob) {
      button = (<button className={this.style.copyLinkNew} onClick={this.saveRecommendation.bind(this)}>Generate recommendation</button>)
      info = (<p className={this.style.copy}>That's a job and hirer match! 😎 Click the button above to recommend this person 💅🏼</p>)
    }

    return { button, info }
  }

  simpleJobsList () {
    return get(this.props, 'expandedJobs', []).map(job => {
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

  renderRecommendationsAdder () {
    const placeholder = 'Type a company name or job title'
    const recommendationJobs = this.simpleJobsList()

    const { recommendationJobId, recommendationHirerId } = this.state
    const { button, info } = this.renderRecommendationActions(recommendationJobId, recommendationHirerId)

    let hirerChoice = (<span />)
    const existingJob = get(this.props, 'expandedJobs', []).find(job => job.id === recommendationJobId)

    if (existingJob) {
      const hirers = get(existingJob, 'company.hirers', [])
      hirerChoice = (<div className={this.style.missingGroup}>
        <select className={this.style.selectBox} value={recommendationHirerId} onChange={this.onChangeRecommendationHirer.bind(this)}>
          <option>Choose a hirer to recommend this person to</option>
          {hirers.map(hirer => {
            const name = `${get(hirer, 'person.firstName', '')} ${get(hirer, 'person.lastName', '')}`
            return (<option value={get(hirer, 'id')}>{name}</option>)
          })}
        </select>
      </div>)
    }

    return (<div className={this.style.missing}>
      <div className={this.style.missingGroup}>
        <Autocomplete
          placeholder={placeholder}
          suggestions={recommendationJobs}
          reset={this.state.resetRecommendation}
          onChange={this.onChangeRecommendation.bind(this)} />
        {hirerChoice}
      </div>
      {button}
      {info}
    </div>)
  }

  renderTasksSection () {
    const tasksList = (<TasksList {...this.props} />)
    const taskAdder = (<TaskAdder {...this.props} onSubmit={this.onAddTask.bind(this)} submitLabel='Add task for this hirer' />)

    const hirer = get(this.props, 'hirer', '')

    if (!hirer) {
      return (<span />)
    }

    return (<div>
      <hr className={this.style.sectionDivider} />
      <h3 className={this.style.pageHeadline}>Tasks</h3>
      <div className={this.style.pageMain}>
        {tasksList}
      </div>
      <h4 className={this.style.pageHeadline}>Add <Plural zero='a' singular='another' count={get(this.props, 'tasks', []).length} /> task</h4>
      {taskAdder}
    </div>)
  }

  render () {
    const people = get(this.props, 'people', [])
    const person = get(this.props, 'person', {})

    const personName = `${get(person, 'firstName', '')} ${get(person, 'lastName', '')}`

    const editPersonForm = (<PersonForm
      people={people}
      person={person}
      reset={this.state.resetForm}
      onSubmit={this.onSubmit.bind(this)}
      submitLabel='Save changes' />)

    const referralsList = this.renderReferralsList()
    const referralsAdder = this.renderReferralAdder()

    const recommendationsList = this.renderRecommendationsList()
    const recommendationsAdder = this.renderRecommendationsAdder()

    const taskSection = this.renderTasksSection()

    return (
      <Page {...this.props} className={this.style.pageBody}>
        <Helmet>
          <title>{`ADMIN - ${personName}`}</title>
        </Helmet>
        <PageHeader title={personName}>
          <h4>{get(this.props, 'person.email')}</h4>
        </PageHeader>
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
            <hr className={this.style.sectionDivider} />
            <h3 className={this.style.pageHeadline}>Recommendations</h3>
            <div className={this.style.pageMain}>
              {recommendationsList}
            </div>
            <h4 className={this.style.pageHeadline}>Add <Plural zero='a' singular='another' count={get(this.props, 'recommendations', []).length} /> recommendation</h4>
            <div className={this.style.pageMain}>
              {recommendationsAdder}
            </div>
            {taskSection}
          </div>
        </div>
      </Page>
    )
  }
}
