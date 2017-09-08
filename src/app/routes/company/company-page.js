const React = require('react')
const { Link } = require('react-router-dom')
const get = require('lodash/get')
const format = require('date-fns/format')
const differenceInMinutes = require('date-fns/difference_in_minutes')
const { Helmet } = require('react-helmet')
const isEmail = require('validator/lib/isEmail')

const getStyle = require('./company-page.css')
const Page = require('../../components/page/page')
const Autocomplete = require('../../components/autocomplete/autocomplete')
const PageHeader = require('../../components/page-header/page-header')
const RowItem = require('../../components/row-item/row-item')
const Tooltip = require('../../components/tooltip/tooltip')
const CompanyForm = require('../../components/company-form/company-form')
const JobForm = require('../../components/job-form/job-form')
const Plural = require('../../components/plural/plural')
const CopyToClipboard = require('../../components/copy-to-clipboard/copy-to-clipboard')
const TasksList = require('../../components/tasks-list/tasks-list')
const TaskAdder = require('../../components/task-adder/task-adder')
const { postData } = require('../../redux/actions/app')

module.exports = class JobsPage extends React.Component {
  constructor (props) {
    super(props)
    this.style = getStyle()
    const resetCompanyForm = false
    const resetJobForm = false
    const surveyLink = get(this.props, 'survey.link')
    const surveyUuid = get(this.props, 'survey.uuid')
    this.state = { resetCompanyForm, resetJobForm, surveyLink, surveyUuid }
  }

  componentWillReceiveProps (nextProps) {
    const resetCompanyForm = !!get(nextProps, 'savedCompany')
    const resetJobForm = !!get(nextProps, 'newJob')
    const resetHirerForm = !!get(nextProps, 'newHirer')

    if (resetCompanyForm && resetCompanyForm !== this.state.resetCompanyForm) {
      this.setState({ resetCompanyForm })
    }

    if (resetJobForm && resetJobForm !== this.state.resetJobForm) {
      this.setState({ resetJobForm })
    }

    if (resetHirerForm && resetHirerForm !== this.state.resetJobForm) {
      this.setState({ resetHirerForm }, () => {
        const resetHirerForm = false
        this.setState({ resetHirerForm })
      })
    }
  }

  getPersonFromEmail (email) {
    const people = get(this.props, 'people', [])
    return people.find(person => person.email === email)
  }

  onAddTask (task) {
    const companySlug = get(this.props, 'company.slug', '')
    const taskType = get(task, 'type', '')
    const url = `/${companySlug}/tasks/${taskType}`
    const data = {}
    const method = 'post'

    this.props.dispatch(postData({ url, data, method }))
  }

  onChangeHirer (value, matches) {
    let hirerValue = value
    if (!isEmail(hirerValue) && matches.length === 1) {
      // in this case 'id' is the email as put together in `render`
      const email = get(matches[0], 'id', '')
      hirerValue = value.indexOf(email) === 0 ? email : hirerValue
    }
    this.setState({hirerValue})
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

  saveHirerCommon ({email, personId}) {
    const companySlug = get(this.props, 'company.slug')
    const url = personId ? `/${companySlug}/hirers/${personId}` : `/${companySlug}/hirers`
    const method = 'post'
    const data = {email}

    this.setState({
      hirerValue: ''
    }, () => this.props.dispatch(postData({ url, data, method })))
  }

  saveHirer (event) {
    const email = this.state.hirerValue.toString()
    const person = this.getPersonFromEmail(email)
    const personId = get(person, 'id')
    this.saveHirerCommon({email, personId})
  }

  saveUser (event) {
    const email = this.state.hirerValue.toString()
    this.saveHirerCommon({email})
  }

  addHirerForm () {
    const placeholder = 'Type a name or email'
    const people = get(this.props, 'people', [])
    const { hirerValue, resetHirerForm } = this.state

    const suggestions = people.map(person => {
      const id = person.email
      const value = `${get(person, 'email')} - ${get(person, 'firstName', '-')} ${get(person, 'lastName', '-')}`
      return { id, value }
    })

    const { button, info } = this.renderHirerActions(hirerValue)

    return (<div className={this.style.missing}>
      <div className={this.style.missingGroup}>
        <Autocomplete
          placeholder={placeholder}
          suggestions={suggestions}
          reset={resetHirerForm}
          onChange={this.onChangeHirer.bind(this)} />
        {button}
      </div>
      {info}
    </div>)
  }

  addTaskForm () {
    return (<span />)
  }

  renderJobsList () {
    const jobs = get(this.props, 'jobs', [])
    const companySlug = get(this.props, 'company.slug')
    const rightNow = new Date()
    const webHostname = get(this.props, 'web.hostname')

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
        uri={`//${webHostname}/jobs/${companySlug}+${jobSlug}`}
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

  onChangeSurveyLink (event) {
    this.setState({
      surveyLink: event.target.value
    })
  }

  onChangeSurveyUuid (event) {
    this.setState({
      surveyUuid: event.target.value
    })
  }

  onSubmitLink () {
    const company = get(this.props, 'company')
    const survey = get(this.props, 'survey')
    const url = `/${company.slug}/surveys${survey ? `/${survey.id}` : ''}`
    const method = survey ? 'patch' : 'post'

    this.props.dispatch(postData({
      url,
      method,
      data: {
        company: company.id,
        link: get(this.state, 'surveyLink'),
        uuid: get(this.state, 'surveyUuid')
      }
    }))
  }

  renderSurveyLink () {
    const surveyLink = get(this.state, 'surveyLink')
    const surveyUuid = get(this.state, 'surveyUuid')

    return (
      <div className={this.style.missing}>
        <ul className={this.style.formList}>
          <li className={this.style.formListItem}>
            <label className={this.style.label} htmlFor='surveyLink'>Link</label>
            <input className={this.style.inputBoxUrl} type='text' id='surveyLink' name='surveyLink' onChange={this.onChangeSurveyLink.bind(this)} value={surveyLink} />
          </li>
          <li className={this.style.formListItem}>
            <label className={this.style.label} htmlFor='surveyUuid'>Typeform UUID</label>
            <input className={this.style.inputBoxUrl} type='text' id='surveyUuid' name='surveyUuid' onChange={this.onChangeSurveyUuid.bind(this)} value={surveyUuid} />
          </li>
        </ul>
        <div className={this.style.formButtons}>
          <CopyToClipboard className={this.style.nudj} data-clipboard-text={surveyLink}>Copy link</CopyToClipboard>
          <button className={this.style.nudj} onClick={this.onSubmitLink.bind(this)}>Update</button>
        </div>
      </div>
    )
  }

  renderSurveyEmailsList () {
    const emails = get(this.props, 'surveyMessages', [])
    const companySlug = get(this.props, 'company.slug')

    const emailsList = emails.map((email) => {
      const id = get(email, 'id')
      const hirer = get(email, 'hirer')
      const subject = get(email, 'subject')
      const sendDate = format(get(email, 'created'), 'DD.MM.YYYY - HH:mm')
      const recipients = get(email, 'recipients', [])
      const recipientsList = recipients.join(', ')
      const amountSent = recipients.length

      return (
        <RowItem
          key={id}
          title={hirer}
          details={[{
            term: 'Date',
            description: sendDate
          }, {
            term: 'Subject',
            description: subject
          }, {
            term: 'Sent To',
            description: recipientsList
          }, {
            term: 'No. Sent',
            description: amountSent
          }]}
          actions={[
            <Link className={this.style.nudj} to={`/${companySlug}/messages/${id}`}>View email</Link>
          ]}
        />
      )
    })

    return (<ul className={this.style.jobs}>
      {emailsList}
    </ul>)
  }

  renderHirerActions (value) {
    const hirers = get(this.props, 'hirers', [])

    let button = (<span />)
    let info = (<span />)

    // Check is value an email,
    if (!value || !isEmail(value)) {
      return { button, info }
    }

    const person = this.getPersonFromEmail(value)
    const personId = get(person, 'id')
    const hirer = hirers.find(hirer => hirer.person === personId)

    // if so is it already in the referrals?
    if (hirer) {
      info = (<p className={this.style.copy}>This person's already a hirer for this company 💅🏼 They should be in the hirers list above ⬆️.</p>)
    } else if (person) {
      //  if so make the connection
      button = (<button className={this.style.copyLinkNew} onClick={this.saveHirer.bind(this)}>Save as hirer</button>)
      info = (<p className={this.style.copy}>This person's already in our database 😎 Click the button above to save them as a hirer for this company 💅🏼</p>)
    } else {
      button = (<button className={this.style.copyLinkNew} onClick={this.saveUser.bind(this)}>Save as a user and generate referral link</button>)
      info = (<p className={this.style.copy}>Got no idea who this is 🤷‍ Click the button above to save them as a user and add them as a hirer for this company 💅🏼</p>)
    }

    return { button, info }
  }

  renderHirersList () {
    const hirers = get(this.props, 'hirers', [])

    const hirersList = hirers.map(hirer => {
      const id = get(hirer, 'id')
      const person = get(hirer, 'person')
      const personId = get(person, 'id')
      const personTitle = `${get(person, 'firstName')} ${get(person, 'lastName')} (${get(person, 'email')})`

      return (<RowItem
        key={id}
        rowClass='rowSmall'
        title={personTitle}
        details={[]}
        actions={[
          <Link className={this.style.nudj} to={`/people/${personId}`}>See person</Link>
        ]}
      />)
    })

    return (<ul className={this.style.hirers}>
      {hirersList}
    </ul>)
  }

  render () {
    const jobs = get(this.props, 'jobs', [])
    const hirers = get(this.props, 'hirers', [])
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

    const hirersList = this.renderHirersList()
    const addHirerForm = this.addHirerForm()

    const tasksList = (<TasksList {...this.props} />)
    const addTaskForm = (<TaskAdder {...this.props} onSubmit={this.onAddTask.bind(this)} submitLabel='Add task for this company' />)

    const jobsList = this.renderJobsList()
    const surveyLink = this.renderSurveyLink()
    const surveyEmailsList = this.renderSurveyEmailsList()

    const addJobForm = (<JobForm
      jobs={jobs}
      reset={this.state.resetJobForm}
      onSubmit={this.onSubmitJob.bind(this)}
      submitLabel='Add job' />)

    const publishedJobs = jobs.filter(job => job.status === 'PUBLISHED')

    return (
      <Page {...this.props} className={this.style.pageBody}>
        <Helmet>
          <title>{`ADMIN - ${companyName}`}</title>
        </Helmet>
        <PageHeader title={companyName} subtitle={`Jobs and Hirers`} />
        <h3 className={this.style.pageHeadline}>
          <span className={this.style.pageHeadlineHighlight}>{companyName}</span>
        </h3>
        <div className={this.style.pageContent}>
          {editCompanyForm}
          <div className={this.style.pageSidebar} />
        </div>
        <h4 className={this.style.pageHeadline}>Hirers</h4>
        <div className={this.style.pageContent}>
          <div className={this.style.pageMain}>
            {hirersList}
          </div>
          <div className={this.style.pageSidebar} />
        </div>
        <h4 className={this.style.pageHeadline}>Add <Plural zero='a' singular='another' count={hirers.length} /> hirer</h4>
        <div className={this.style.pageContent}>
          <div className={this.style.pageMain}>
            {addHirerForm}
          </div>
          <div className={this.style.pageSidebar} />
        </div>
        <hr className={this.style.sectionDivider} />
        <h3 className={this.style.pageHeadline}>Tasks</h3>
        <div className={this.style.pageMain}>
          {tasksList}
        </div>
        <h4 className={this.style.pageHeadline}>Add <Plural zero='a' singular='another' count={get(this.props, 'tasks', []).length} /> task</h4>
        {addTaskForm}
        <hr className={this.style.sectionDivider} />
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
        <h4 className={this.style.pageHeadline}>Add <Plural zero='a' singular='another' count={jobs.length} /> job</h4>
        <div className={this.style.pageContent}>
          {addJobForm}
          <div className={this.style.pageSidebar} />
        </div>
        <h4 className={this.style.pageHeadline}>Survey Link</h4>
        <div className={this.style.pageContent}>
          <div className={this.style.pageMain}>
            {surveyLink}
          </div>
          <div className={this.style.pageSidebar} />
        </div>
        <h4 className={this.style.pageHeadline}>Survey Emails</h4>
        <div className={this.style.pageContent}>
          <div className={this.style.pageMain}>
            {surveyEmailsList}
          </div>
          <div className={this.style.pageSidebar} />
        </div>
      </Page>
    )
  }
}
