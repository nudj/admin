const React = require('react')
const get = require('lodash/get')
const merge = require('lodash/merge')
const getStyle = require('./job-form.css')

module.exports = class CompaniesPage extends React.Component {
  constructor (props) {
    super(props)
    this.style = getStyle()
    this.submit = get(props, 'onSubmit')
    const job = merge({}, this.cleanJob(), get(props, 'job', this.cleanJob()))
    this.state = { job }
  }

  componentDidMount () {
    const validation = this.cleanValidation()
    this.updateValidation(validation)
  }

  componentWillReceiveProps (nextProps) {
    const reset = !!get(nextProps, 'reset')

    if (!reset) {
      return
    }

    const jobForm = this.refs.jobForm
    jobForm.reset()

    const job = merge({}, this.cleanJob(), get(this.props, 'job', this.cleanJob()))
    const validation = this.cleanValidation()

    this.setState({ job, validation })
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
      companyId: get(this.props, 'company.id'),
      related: []
    }
  }

  cleanValidation () {
    const slug = get(this.state, 'job.slug', '')
    const title = get(this.state, 'job.title', '')
    return {
      slug: {
        empty: !slug,
        notUnique: !this.isSlugUnique(slug)
      },
      title: {
        empty: !title,
        notUnique: !this.isTitleUnique(title)
      }
    }
  }

  makeSlugFromName (name) {
    return name.toLowerCase()
      .replace(/\s+/g, ' ')
      .replace(/\s/g, '-')
      .replace(/[^a-z0-9-]/g, '')
  }

  onChangeTitle (event) {
    const title = event.target.value
    const slug = this.makeSlugFromName(title)

    this.updateJob({ slug, title })

    const validation = {
      slug: {
        empty: !slug,
        notUnique: !this.isSlugUnique(slug)
      },
      title: {
        empty: !title,
        notUnique: !this.isTitleUnique(title)
      }
    }

    this.updateValidation(validation)
  }

  onChangeSlug (event) {
    const slug = this.makeSlugFromName(event.target.value)

    this.updateJob({ slug })

    const validation = {
      slug: {
        empty: !slug,
        notUnique: !this.isSlugUnique(slug)
      }
    }

    this.updateValidation(validation)
  }

  onChangeGeneric (event) {
    const value = event.target.value
    const key = event.target.name

    this.updateJob({ [key]: value })
  }

  isJobValid () {
    const slugEmpty = get(this.state.validation, 'slug.empty', false)
    const titleEmpty = get(this.state.validation, 'title.empty', false)

    if (slugEmpty || titleEmpty) {
      return false
    }

    const slugFail = get(this.state.validation, 'slug.notUnique', false)
    const titleFail = get(this.state.validation, 'title.notUnique', false)

    if (slugFail || titleFail) {
      return false
    }

    return true
  }

  isPropUnique (value, propKey) {
    const jobs = get(this.props, 'jobs', [])
    const found = jobs.find(job => get(job, propKey, '').toLowerCase() === value.toLowerCase())
    const existingJobValue = get(this.props, `job.${propKey}`, '').toLowerCase()
    // If it was found, but it also matches the existing job then it's inferred that it's still unique
    return existingJobValue && found ? existingJobValue === value.toLowerCase() : !found
  }

  isSlugUnique (slug) {
    return this.isPropUnique(slug, 'slug')
  }

  isTitleUnique (title) {
    return this.isPropUnique(title, 'title')
  }

  onSubmit (event) {
    event.preventDefault()

    if (!this.isJobValid()) {
      return false
    }

    const submit = get(this.props, 'onSubmit', () => {})
    const data = get(this.state, 'job', {})

    submit(data)
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

    if (get(this.state.validation, 'slug.notUnique', false)) {
      errorLabels.jobSlugNotUniqueLabel = this.renderErrorLabel('There\'s already another job with that slug', 'jobSlug')
    }

    if (get(this.state.validation, 'title.notUnique', false)) {
      errorLabels.jobTitleNotUniqueLabel = this.renderErrorLabel('There\'s already another job with this title', 'jobTitle')
    }

    return errorLabels
  }

  render () {
    const job = get(this.state, 'job', {})

    const errorLabels = this.renderErrorLabels()
    const submitLabel = get(this.props, 'submitLabel', 'Add job')
    let submitButton = (<button className={this.style.submitButton}>{submitLabel}</button>)

    if (!this.isJobValid()) {
      submitButton = (<button className={this.style.submitButton} disabled>{submitLabel}</button>)
    }

    const statuses = ['Draft', 'Published', 'Archived']
    const types = ['Permanent', 'Contract', 'Freelance']

    return (<form className={this.style.pageMain} onSubmit={this.onSubmit.bind(this)} ref='jobForm'>
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
            <input className={this.style.inputBoxUrl} type='uri' placeholder='eg: https://www.company.com/link-to-job' id='newJobUrl' name='url' onChange={this.onChangeGeneric.bind(this)} value={job.url} />
          </li>
          <li className={this.style.formListItem}>
            <label className={this.style.label} htmlFor='newJobBonus'>Bonus (without currency symbol)</label>
            <input className={this.style.inputBox} type='number' placeholder='eg: 200' id='newJobBonus' name='bonus' required onChange={this.onChangeGeneric.bind(this)} value={job.bonus} />
          </li>
          <li className={this.style.formListItem}>
            <label className={this.style.label} htmlFor='newJobType'>Type</label>
            <select className={this.style.selectBox} id='newJobType' name='type' onChange={this.onChangeGeneric.bind(this)} value={job.type || types[0]}>
              {types.map((type, index) => (<option key={index} value={type}>{type}</option>))}
            </select>
          </li>
          <li className={this.style.formListItem}>
            <label className={this.style.label} htmlFor='newJobStatus'>Status</label>
            <select className={this.style.selectBox} id='newJobStatus' name='status' onChange={this.onChangeGeneric.bind(this)} value={job.status || statuses[0]}>
              {statuses.map((status, index) => (<option key={index} value={status}>{status}</option>))}
            </select>
          </li>
          <li className={this.style.formListItem}>
            <label className={this.style.label} htmlFor='newJobDescription'>Description</label>
            <textarea className={this.style.inputTextarea} id='newJobDescription' name='description' required onChange={this.onChangeGeneric.bind(this)} value={job.description} />
          </li>
          <li className={this.style.formListItem}>
            <label className={this.style.label} htmlFor='newJobRemuneration'>Remuneration</label>
            <textarea className={this.style.inputTextarea} id='newJobRemuneration' name='remuneration' required onChange={this.onChangeGeneric.bind(this)} value={job.remuneration} />
          </li>
          <li className={this.style.formListItem}>
            <label className={this.style.label} htmlFor='newJobLocation'>Location</label>
            <input className={this.style.inputBox} type='text' placeholder='eg: London' id='newJobLocation' required name='location' onChange={this.onChangeGeneric.bind(this)} value={job.location} />
          </li>
        </ul>
        <div className={this.style.formButtons}>
          {submitButton}
        </div>
      </div>
    </form>)
  }
}
