const React = require('react')
const { Link } = require('react-router-dom')
const get = require('lodash/get')
const merge = require('lodash/merge')
const format = require('date-fns/format')
const differenceInMinutes = require('date-fns/difference_in_minutes')
const { Helmet } = require('react-helmet')
const getStyle = require('./jobs-page.css')
const PageHeader = require('../page-header/page-header')
const RowItem = require('../row-item/row-item')
const Tooltip = require('../tooltip/tooltip')
const { postData } = require('../../actions/app')

// To be replaced by the library soon
const makeSlug = function (name) {
  return name.toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/\s/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

module.exports = class JobsPage extends React.Component {
  constructor (props) {
    super(props)
    this.style = getStyle()
    const validation = this.cleanValidation()
    const job = this.cleanJob()
    this.state = {job, validation}
  }

  componentWillReceiveProps (nextProps) {
    const isNewJob = !!get(nextProps, 'newJob')

    if (!isNewJob) {
      return
    }

    const newJobForm = this.refs.newJobForm
    newJobForm.reset()

    this.setState({
      job: this.cleanJob(),
      validation: this.cleanValidation()
    })
  }

  cleanJob () {
    return {
      title: '',
      slug: '',
      url: '',
      status: 'Draft', // 'Published', 'Archived'
      bonus: 0,
      description: '',
      type: 'Permanent', // 'Contract', 'Freelance'
      remuneration: '',
      tags: [],
      location: '',
      // companyId: companyId,
      related: []
    }
  }

  cleanValidation () {
    return {
      title: {
        empty: !get(this.state, 'job.title', '')
      },
      slug: {
        empty: !get(this.state, 'job.slug', '')
      }
    }
  }

  onChangeTitle (event) {
    const title = event.target.value
    const slug = makeSlug(title)

    this.updateJob({ title, slug })

    const jobs = get(this.props, 'jobs', [])
    const validation = {
      title: {
        empty: !title,
        notUnique: !!(jobs.find(job => job.title.toLowerCase() === title.toLowerCase()))
      },
      slug: {
        empty: !slug,
        notUnique: !!(jobs.find(job => job.slug.toLowerCase() === slug.toLowerCase()))
      }
    }

    this.updateValidation(validation)
  }

  onChangeSlug (event) {
    const slug = makeSlug(event.target.value)

    this.updateJob({ slug })

    const jobs = get(this.props, 'jobs', [])
    const validation = {
      slug: {
        empty: !slug,
        notUnique: !!(jobs.find(job => job.slug.toLowerCase() === slug.toLowerCase()))
      }
    }

    this.updateValidation(validation)
  }

  onChangeGeneric (event) {
    const value = event.target.value
    const key = event.target.name

    this.updateJob({ [key]: value })
  }

  isNewJobValid () {
    const titleEmpty = get(this.state.validation, 'title.empty', false)
    const slugEmpty = get(this.state.validation, 'slug.empty', false)

    if (titleEmpty || slugEmpty) {
      return false
    }

    // Title can fail uniqueness validation but still be part of a valid record
    const slugFail = get(this.state.validation, 'slug.notUnique', false)

    if (slugFail) {
      return false
    }

    return true
  }

  onSubmit (event) {
    event.preventDefault()

    if (!this.isNewJobValid()) {
      return false
    }

    const companySlug = get(this.props, 'company.slug')

    const url = `/${companySlug}/jobs`
    const method = 'post'
    const data = get(this.state, 'job', {})

    if (data.bonus) {
      data.bonus = parseInt(data.bonus)
    }

    this.props.dispatch(postData({ url, data, method }))
  }

  updateJob (newStuff) {
    const job = merge({}, get(this.state, 'job', {}), newStuff)
    this.setState({ job })
  }

  updateValidation (newStuff) {
    const validation = merge(this.cleanValidation(), get(this.state, 'validation', {}), newStuff)
    this.setState({ validation })
  }

  renderErrorLabel (text, htmlFor) {
    return (<label className={this.style.errorLabel} htmlFor={htmlFor}>{text}</label>)
  }

  renderErrorLabels () {
    const errorLabels = {
      jobTitleNotUniqueLabel: (<span />),
      jobSlugNotUniqueLabel: (<span />)
    }

    if (get(this.state.validation, 'title.notUnique', false)) {
      errorLabels.jobTitleNotUniqueLabel = this.renderErrorLabel('There\'s already another job with this title', 'newJobTitle')
    }

    if (get(this.state.validation, 'slug.notUnique', false)) {
      errorLabels.jobSlugNotUniqueLabel = this.renderErrorLabel('There\'s already another job with that slug', 'newJobSlug')
    }

    return errorLabels
  }

  renderAddJobForm () {
    const job = get(this.state, 'job', {})

    const errorLabels = this.renderErrorLabels()
    let submitButton = (<button className={this.style.submitButton}>Add job</button>)

    if (!this.isNewJobValid()) {
      submitButton = (<button className={this.style.submitButton} disabled>Add job</button>)
    }

    const types = ['Permanent', 'Contract', 'Freelance']
    // set job.type to permanent?

    // tags: [],
    // related: []
    // Related job
    // each:
    // {
    //   id: 1,
    //   url: /esse/impedit-aliquam, // Relative job URL
    //   title: Eum dolorem aut,
    //   location: Ramonaburgh,
    //   jobName: Gutmann Ltd
    // }

    return (<form className={this.style.pageMain} onSubmit={this.onSubmit.bind(this)} ref='newJobForm'>
      <div className={this.style.formCard}>
        <ul className={this.style.formList}>
          <li className={this.style.formListItem}>
            <label className={this.style.label} htmlFor='newJobTitle'>Title</label>
            <input className={this.style.inputBox} type='text' id='newJobTitle' name='title' required onChange={this.onChangeTitle.bind(this)} value={job.title} />
            {errorLabels.jobTitleNotUniqueLabel}
          </li>
          <li className={this.style.formListItem}>
            <label className={this.style.label} htmlFor='newJobSlug'>Slug</label>
            <input className={this.style.inputBox} type='text' id='newJobSlug' name='slug' required onChange={this.onChangeSlug.bind(this)} value={job.slug} />
            {errorLabels.jobSlugNotUniqueLabel}
          </li>
          <li className={this.style.formListItem}>
            <label className={this.style.label} htmlFor='newJobUrl'>URL</label>
            <input className={this.style.inputBox} type='uri' placeholder='eg: https://www.company.com/link-to-job' id='newJobUrl' name='url' onChange={this.onChangeGeneric.bind(this)} />
          </li>
          <li className={this.style.formListItem}>
            <label className={this.style.label} htmlFor='newJobBonus'>Bonus (without currency symbol)</label>
            <input className={this.style.inputBox} type='number' placeholder='eg: 200' id='newJobBonus' name='bonus' required onChange={this.onChangeGeneric.bind(this)} />
          </li>
          <li className={this.style.formListItem}>
            <label className={this.style.label} htmlFor='newJobType'>Type</label>
            <select className={this.style.selectBox} id='newJobType' name='type' onChange={this.onChangeGeneric.bind(this)}>
              {types.map((type, index) => (<option key={index} value={type}>{type}</option>))}
            </select>
          </li>
          <li className={this.style.formListItem}>
            <label className={this.style.label} htmlFor='newJobDescription'>Description</label>
            <textarea className={this.style.inputTextarea} id='newJobDescription' name='description' required onChange={this.onChangeGeneric.bind(this)} />
          </li>
          <li className={this.style.formListItem}>
            <label className={this.style.label} htmlFor='newJobRemuneration'>Remuneration</label>
            <textarea className={this.style.inputTextarea} id='newJobRemuneration' name='remuneration' required onChange={this.onChangeGeneric.bind(this)} />
          </li>
          <li className={this.style.formListItem}>
            <label className={this.style.label} htmlFor='newJobLocation'>Location</label>
            <input className={this.style.inputBox} type='text' placeholder='eg: London' id='newJobLocation' required name='location' onChange={this.onChangeGeneric.bind(this)} />
          </li>
        </ul>
        <div className={this.style.formButtons}>
          {submitButton}
        </div>
      </div>
      <input type='hidden' name='status' value='Draft' />
    </form>)
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
    const company = get(this.props, 'company', {})
    const tooltip = get(this.props, 'tooltip')

    const companyName = get(company, 'name')

    const jobsList = this.renderJobsList()
    const addJobForm = this.renderAddJobForm()

    const publishedJobs = jobs.filter(job => job.status === 'Published')

    return (
      <div className={this.style.pageBody}>
        <Helmet>
          <title>{`nudj - Jobs @ ${companyName}`}</title>
        </Helmet>
        <PageHeader title='Jobs' subtitle={`@ ${companyName}`} />
        <h3 className={this.style.pageHeadline}>
          <span className={this.style.pageHeadlineHighlight}>{companyName}</span> jobs: published <span className={this.style.pageHeadlineHighlight}>({publishedJobs.length})</span> / total <span className={this.style.pageHeadlineHighlight}>({jobs.length})</span>
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
