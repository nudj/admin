const React = require('react')
const { Link } = require('react-router-dom')
const get = require('lodash/get')
const omit = require('lodash/omit')
const format = require('date-fns/format')
const differenceInMinutes = require('date-fns/difference_in_minutes')
const { Helmet } = require('react-helmet')
const isEmail = require('validator/lib/isEmail')
const actions = require('@nudj/framework/actions')

const getStyle = require('./style.css')
const Page = require('../../components/page')
const Autocomplete = require('../../components/autocomplete')
const RowItem = require('../../components/row-item')
const CompanyForm = require('../../components/company-form')
const JobForm = require('../../components/job-form')
const Plural = require('../../components/plural')

module.exports = class CompanyPage extends React.Component {
  constructor (props) {
    super(props)
    this.style = getStyle()
    const resetCompanyForm = false
    const resetJobForm = false

    this.state = { resetCompanyForm, resetJobForm }
  }

  componentWillReceiveProps (nextProps) {
    const resetCompanyForm = !!get(nextProps, 'savedCompany')
    const resetJobForm = !!get(nextProps, 'app.company.newJob')
    const resetHirerForm = !!get(nextProps, 'app.company.newHirer')

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

    const url = `/companies/${companySlug}/jobs`
    const method = 'post'

    this.props.dispatch(actions.app.postData({ url, data, method }))
  }

  onSubmitCompanyChanges (data) {
    const companySlug = data.slug
    const url = `/companies/${companySlug}`
    const method = 'put'

    this.props.dispatch(actions.app.postData({ url, data, method }))
  }

  saveHirerCommon ({ email, personId }) {
    const companySlug = get(this.props.app, 'company.slug')
    const companyId = get(this.props.app, 'company.id')
    const url = `/companies/${companySlug}/hirers`
    const method = 'post'
    const data = { email, company: companyId }

    this.setState({
      hirerValue: ''
    }, () => this.props.dispatch(actions.app.postData({ url, data, method })))
  }

  saveHirer (event) {
    const email = this.state.hirerValue.toString()
    const person = this.getPersonFromEmail(email)
    const personId = get(person, 'id')
    this.saveHirerCommon({email, personId})
  }

  saveUser (event) {
    const email = this.state.hirerValue.toString()
    this.saveHirerCommon({ email })
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

  renderJobsList () {
    const jobs = get(this.props.app, 'company.jobs', [])
    const companySlug = get(this.props.app, 'company.slug')
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
          <Link className={this.style.nudj} to={`/companies/${companySlug}/jobs/${jobSlug}`}>See job</Link>
        ]}
      />)
    })

    return (<ul className={this.style.jobs}>
      {jobsList}
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
    const hirersList = hirers.map(hirer => ({
      ...hirer,
      person: get(hirer, 'person.id')
    }))
    const hirer = hirersList.find(hirer => hirer.person === personId)

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
    const hirers = get(this.props.app, 'company.hirers', [])

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
    const companyData = get(this.props.app, 'company', {})
    const company = omit(companyData, ['jobs', 'hirers'])
    const companies = get(this.props.app, 'companies', [])
    const templateTags = get(this.props.app, 'jobTemplateTags', [])
    const jobs = get(companyData, 'jobs', [])
    const hirers = get(companyData, 'hirers', [])
    const companyName = get(companyData, 'name')

    const editCompanyForm = (<CompanyForm
      companies={companies}
      company={company}
      reset={this.state.resetCompanyForm}
      onSubmit={this.onSubmitCompanyChanges.bind(this)}
      submitLabel='Save changes' />)

    const hirersList = this.renderHirersList()
    const addHirerForm = this.addHirerForm()

    const jobsList = this.renderJobsList()

    const addJobForm = (<JobForm
      company={company}
      jobs={jobs}
      reset={this.state.resetJobForm}
      templateTags={templateTags}
      onSubmit={this.onSubmitJob.bind(this)}
      submitLabel='Add job' />)

    const publishedJobs = jobs.filter(job => job.status === 'PUBLISHED')

    return (
      <Page
        {...this.props}
        title={companyName}
        description='Jobs and Hirers'
        actions={(
          <Link
            className={this.style.nudj}
            to={`/surveys?company=${company.id}`}
          >
            Company Surveys
          </Link>
        )}
      >
        <Helmet>
          <title>{`ADMIN - ${companyName}`}</title>
        </Helmet>
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
        <h3 className={this.style.pageHeadline}>
          Jobs: published <span className={this.style.pageHeadlineHighlight}>({publishedJobs.length})</span> / total <span className={this.style.pageHeadlineHighlight}>({jobs.length})</span>
        </h3>
        <div className={this.style.pageContent}>
          <div className={this.style.pageMain}>
            {jobsList}
          </div>
        </div>
        <h4 className={this.style.pageHeadline}>Add <Plural zero='a' singular='another' count={jobs.length} /> job</h4>
        <div className={this.style.pageContent}>
          {addJobForm}
          <div className={this.style.pageSidebar} />
        </div>
      </Page>
    )
  }
}
