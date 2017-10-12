const React = require('react')
const get = require('lodash/get')
const difference = require('lodash/difference')
const compact = require('lodash/compact')
const { merge } = require('@nudj/library')

const getStyle = require('./job-form.css')

const normaliseItem = (item) => item ? item.join(', ') : ''
const normaliseJob = (job) => merge(job, {
  tags: normaliseItem(job.tags),
  templateTags: normaliseItem(job.templateTags)
})
const denormaliseItem = (item) => {
  if (!item || !item.replace(/\s/g, '')) {
    return []
  }
  return item.replace(/\s/g, '').split(',')
}
const denormaliseJob = (job) => merge(job, {
  tags: denormaliseItem(job.tags),
  templateTags: denormaliseItem(job.templateTags)
})

module.exports = class JobForm extends React.Component {
  constructor (props) {
    super(props)
    this.style = getStyle()
    this.submit = get(props, 'onSubmit')
    const job = normaliseJob(get(props, 'job', this.cleanJob()))
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

    const job = normaliseJob(get(nextProps, 'job', this.cleanJob()))
    const validation = this.cleanValidation()

    this.setState({ job, validation })
  }

  cleanJob () {
    return {
      title: '',
      slug: '',
      url: '',
      status: 'DRAFT', // 'Published', 'Archived'
      bonus: 0,
      description: '',
      roleDescription: '',
      candidateDescription: '',
      type: 'PERMANENT', // 'Contract', 'Freelance'
      remuneration: '',
      templateTags: [],
      tags: [],
      location: '',
      companyId: get(this.props, 'company.id'),
      relatedJobs: []
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

  clearRelatedJobs () {
    const job = get(this.state, 'job', {})
    job.relatedJobs = []
    this.setState({ job })
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

  onChangeTemplateTags (event) {
    const value = event.target.value
    const key = event.target.name
    const validTags = get(this.props, 'templateTags')
    const tags = compact(value.replace(/\s/g, '').split(','))
    const validity = difference(tags, validTags) // Produces array of tags that aren't included in validTags

    this.updateJob({ [key]: value })

    const validation = {
      templateTags: {
        invalid: !!validity.length
      }
    }
    this.updateValidation(validation)
  }

  onChangeGeneric (event) {
    const value = event.target.value
    const key = event.target.name

    this.updateJob({ [key]: value })
  }

  onChangeMultiSelect (event) {
    const value = event.target.value
    const key = event.target.name

    if (!value) {
      return
    }

    const values = get(this.state, `job[${key}]`, [])
    const index = values.indexOf(value)

    if (index !== -1) {
      values.splice(index, 1)
    } else {
      values.push(value)
    }

    this.updateJob({ [key]: values })
  }

  isJobValid () {
    const slugEmpty = get(this.state.validation, 'slug.empty', false)
    const titleEmpty = get(this.state.validation, 'title.empty', false)
    const invalidTemplateTags = get(this.state.validation, 'templateTags.invalid', false)

    if (slugEmpty || titleEmpty || invalidTemplateTags) {
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
    const job = get(this.state, 'job')

    submit(denormaliseJob(job))
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
      jobSlugNotUniqueLabel: (<span />),
      templateTagsInvalidLabel: (<span />)
    }

    if (get(this.state.validation, 'slug.notUnique', false)) {
      errorLabels.jobSlugNotUniqueLabel = this.renderErrorLabel('There\'s already another job with that slug', 'jobSlug')
    }

    if (get(this.state.validation, 'templateTags.invalid', false)) {
      errorLabels.templateTagsInvalidLabel = this.renderErrorLabel('Those tags don\'t exist', 'jobTemplateTags')
    }

    if (get(this.state.validation, 'title.notUnique', false)) {
      errorLabels.jobTitleNotUniqueLabel = this.renderErrorLabel('There\'s already another job with this title', 'jobTitle')
    }

    return errorLabels
  }

  sortJobsAlphabeticallyByTitle (a, b) {
    return a.title > b.title ? 1 : a.title < b.title ? -1 : 0
  }

  filterOutUnrelatableJobs (relatedJob, jobId, companyId) {
    // Filter out any job that's not in the same company
    // Also filter out the existing job cause it can't be related
    return relatedJob.company === companyId && relatedJob.id !== jobId
  }

  render () {
    const job = get(this.state, 'job', {})

    const errorLabels = this.renderErrorLabels()
    const submitLabel = get(this.props, 'submitLabel', 'Add job')
    let submitButton = (<button className={this.style.submitButton}>{submitLabel}</button>)

    if (!this.isJobValid()) {
      submitButton = (<button className={this.style.submitButton} disabled>{submitLabel}</button>)
    }

    const statuses = ['DRAFT', 'PUBLISHED', 'ARCHIVED']
    const types = ['PERMANENT', 'CONTRACT', 'FREELANCE']

    const companyId = get(this.props, 'company.id')
    const jobId = get(job, 'id')

    const relatedJobs = get(this.props, 'jobs', [])
      .filter(relatedJob => this.filterOutUnrelatableJobs(relatedJob, jobId, companyId))
      .sort(this.sortJobsAlphabeticallyByTitle)

    const expandedDescriptionRequired = !this.state.job.description // If an old description exists, you don't need to add candidateDescription or roleDescription. Otherwise, they're required.

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
            <label className={this.style.label} htmlFor='newJobRoleDescription'>Role Description</label>
            <textarea className={this.style.inputTextarea} id='newJobRoleDescription' name='roleDescription' required={expandedDescriptionRequired} onChange={this.onChangeGeneric.bind(this)} value={job.roleDescription} />
          </li>
          <li className={this.style.formListItem}>
            <label className={this.style.label} htmlFor='newJobDescription'>Candidate Description</label>
            <textarea className={this.style.inputTextarea} id='newJobCandidateDescription' name='candidateDescription' required={expandedDescriptionRequired} onChange={this.onChangeGeneric.bind(this)} value={job.candidateDescription} />
          </li>
          <li className={this.style.formListItem}>
            <label className={this.style.label} htmlFor='description'>Old Description</label>
            <textarea className={this.style.inputTextarea} id='description' name='description' onChange={this.onChangeGeneric.bind(this)} value={job.description} />
          </li>
          <li className={this.style.formListItem}>
            <label className={this.style.label} htmlFor='newJobRemuneration'>Remuneration</label>
            <textarea className={this.style.inputTextarea} id='newJobRemuneration' name='remuneration' required onChange={this.onChangeGeneric.bind(this)} value={job.remuneration} />
          </li>
          <li className={this.style.formListItem}>
            <label className={this.style.label} htmlFor='newJobLocation'>Location</label>
            <input className={this.style.inputBox} type='text' placeholder='eg: London' id='newJobLocation' required name='location' onChange={this.onChangeGeneric.bind(this)} value={job.location} />
          </li>
          <li className={this.style.formListItem}>
            <label className={this.style.label} htmlFor='newJobTags'>Tags</label>
            <input className={this.style.inputBox} type='text' placeholder='eg: finance, tech' id='newJobTags' name='tags' onChange={this.onChangeGeneric.bind(this)} value={job.tags} />
          </li>
          <li className={this.style.formListItem}>
            <label className={this.style.label} htmlFor='newJobTemplateTags'>Template tags</label>
            <input className={this.style.inputBox} type='text' placeholder='eg: food, movies' id='newJobTemplateTags' name='templateTags' onChange={this.onChangeTemplateTags.bind(this)} value={job.templateTags} />
            {errorLabels.templateTagsInvalidLabel}
          </li>
          <li className={this.style.formListItem}>
            <label className={this.style.label} htmlFor='newJobRelatedJobs'>Related jobs</label>
            <select className={this.style.selectBoxMultiple} id='newJobRelatedJobs' name='relatedJobs' multiple onChange={this.onChangeMultiSelect.bind(this)} value={job.relatedJobs}>
              {relatedJobs.map((relatedJob, index) => (<option key={index} value={relatedJob.id}>{relatedJob.title}</option>))}
            </select>
            <button type='button' className={this.style.secondaryButton} onClick={this.clearRelatedJobs.bind(this)}>Clear all</button>
          </li>
        </ul>
        <div className={this.style.formButtons}>
          {submitButton}
        </div>
      </div>
    </form>)
  }
}
