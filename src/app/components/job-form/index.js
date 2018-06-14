const React = require('react')
const get = require('lodash/get')
const difference = require('lodash/difference')
const compact = require('lodash/compact')
const isNil = require('lodash/isNil')
const { merge } = require('@nudj/library')

const { Text, CheckboxGroup } = require('@nudj/components')
const { css } = require('@nudj/components/lib/css')

const { expertiseTags } = require('../../lib/constants')
const style = require('./job-form.css')

const normaliseItem = (item) => item ? item.join(', ') : ''
const normaliseJob = (job) => merge(job, {
  labels: normaliseItem(job.labels),
  templateTags: normaliseItem(job.templateTags)
})
const denormaliseItem = (item) => {
  if (!item || !item.replace(/\s/g, '')) {
    return []
  }
  return item.replace(/\s/g, '').split(',')
}
const denormaliseJob = (job) => merge(job, {
  labels: denormaliseItem(job.labels),
  templateTags: denormaliseItem(job.templateTags)
})

module.exports = class JobForm extends React.Component {
  constructor (props) {
    super(props)
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
      url: '',
      status: 'DRAFT', // 'Published', 'Archived'
      bonus: 0,
      description: '',
      type: 'PERMANENT', // 'Contract', 'Freelance'
      remuneration: '',
      templateTags: [],
      tags: [],
      labels: [],
      location: '',
      relatedJobs: []
    }
  }

  cleanValidation () {
    const title = get(this.state, 'job.title', '')
    return {
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

  onChangeTitle (event) {
    const title = event.target.value

    this.updateJob({ title })

    const validation = {
      title: {
        empty: !title,
        notUnique: !this.isTitleUnique(title)
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

  onChangeTags (event) {
    return this.updateJob({ [event.name]: event.values })
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
    const titleEmpty = get(this.state.validation, 'title.empty', false)
    const invalidTemplateTags = get(this.state.validation, 'templateTags.invalid', false)

    if (titleEmpty || invalidTemplateTags) {
      return false
    }

    const titleFail = get(this.state.validation, 'title.notUnique', false)

    if (titleFail) {
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
    const jobState = get(this.state, 'job', {})
    const job = {
      ...jobState,
      ...newStuff
    }
    this.setState({ job })
  }

  updateValidation (newStuff) {
    const validation = merge(this.cleanValidation(), get(this.state, 'validation', {}), newStuff)
    this.setState({ validation })
  }

  renderErrorLabel (text, htmlFor) {
    return (<label className={css(style.errorLabel)} htmlFor={htmlFor}>{text}</label>)
  }

  renderErrorLabels () {
    const errorLabels = {
      jobTitleNotUniqueLabel: (<span />),
      templateTagsInvalidLabel: (<span />)
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
    let submitButton = (<button className={css(style.submitButton)}>{submitLabel}</button>)

    if (!this.isJobValid()) {
      submitButton = (<button className={css(style.submitButton)} disabled>{submitLabel}</button>)
    }

    const statuses = ['DRAFT', 'PUBLISHED', 'ARCHIVED']
    const types = ['PERMANENT', 'CONTRACT', 'FREELANCE']

    const companyId = get(this.props, 'company.id')
    const jobId = get(job, 'id')

    const relatedJobsList = get(this.props, 'jobs', [])
    const relatedJobs = relatedJobsList.map(job => ({
      ...job,
      company: get(job, 'company.id')
    }))
      .filter(relatedJob => this.filterOutUnrelatableJobs(relatedJob, jobId, companyId))
      .sort(this.sortJobsAlphabeticallyByTitle)

    // If a candidateDescription or roleDescription exists, don't need a description. Otherwise, it's required.
    const { roleDescription, candidateDescription } = this.state.job
    const descriptionRequired = isNil(roleDescription) && isNil(candidateDescription)

    return (<form className={css(style.pageMain)} onSubmit={this.onSubmit.bind(this)} ref='jobForm'>
      <div className={css(style.formCard)}>
        <ul className={css(style.formList)}>
          <li className={css(style.formListItem)}>
            <label className={css(style.label)} htmlFor='newJobTitle'>Title</label>
            <input className={css(style.inputBox)} type='text' id='newJobTitle' name='title' required onChange={this.onChangeTitle.bind(this)} value={job.title} />
            {errorLabels.jobTitleNotUniqueLabel}
          </li>
          {job.slug && (
            <li className={css(style.formListItem)}>
              <label className={css(style.label)} htmlFor='newJobSlug'>Slug</label>
              <Text>{job.slug}</Text>
            </li>
          )}
          <li className={css(style.formListItem)}>
            <label className={css(style.label)} htmlFor='newJobUrl'>URL</label>
            <input className={css(style.inputBoxUrl)} type='uri' placeholder='eg: https://www.company.com/link-to-job' id='newJobUrl' name='url' onChange={this.onChangeGeneric.bind(this)} value={job.url} />
          </li>
          <li className={css(style.formListItem)}>
            <label className={css(style.label)} htmlFor='newJobBonus'>Bonus</label>
            <input className={css(style.inputBox)} type='text' placeholder='eg: £200' id='newJobBonus' name='bonus' required onChange={this.onChangeGeneric.bind(this)} value={job.bonus} />
          </li>
          <li className={css(style.formListItem)}>
            <label className={css(style.label)} htmlFor='newJobType'>Type</label>
            <select className={css(style.selectBox)} id='newJobType' name='type' onChange={this.onChangeGeneric.bind(this)} value={job.type || types[0]}>
              {types.map((type, index) => (<option key={index} value={type}>{type}</option>))}
            </select>
          </li>
          <li className={css(style.formListItem)}>
            <label className={css(style.label)} htmlFor='newJobStatus'>Status</label>
            <select className={css(style.selectBox)} id='newJobStatus' name='status' onChange={this.onChangeGeneric.bind(this)} value={job.status || statuses[0]}>
              {statuses.map((status, index) => (<option key={index} value={status}>{status}</option>))}
            </select>
          </li>
          {!isNil(job.roleDescription) && (
            <li className={css(style.formListItem)}>
              <label className={css(style.label)} htmlFor='newJobRoleDescription'>Role Description (Old)</label>
              <textarea className={css(style.inputTextarea)} id='newJobRoleDescription' name='roleDescription' required={!descriptionRequired} onChange={this.onChangeGeneric.bind(this)} value={job.roleDescription} />
            </li>
          )}
          {!isNil(job.candidateDescription) && (
            <li className={css(style.formListItem)}>
              <label className={css(style.label)} htmlFor='newJobDescription'>Candidate Description (Old)</label>
              <textarea className={css(style.inputTextarea)} id='newJobCandidateDescription' name='candidateDescription' required={!descriptionRequired} onChange={this.onChangeGeneric.bind(this)} value={job.candidateDescription} />
            </li>
          )}
          <li className={css(style.formListItem)}>
            <label className={css(style.label)} htmlFor='description'>Description</label>
            <textarea className={css(style.inputTextarea)} id='description' name='description' required={descriptionRequired} onChange={this.onChangeGeneric.bind(this)} value={job.description} />
          </li>
          <li className={css(style.formListItem)}>
            <label className={css(style.label)} htmlFor='newJobRemuneration'>Remuneration</label>
            <textarea className={css(style.inputTextarea)} id='newJobRemuneration' name='remuneration' required onChange={this.onChangeGeneric.bind(this)} value={job.remuneration} />
          </li>
          <li className={css(style.formListItem)}>
            <label className={css(style.label)} htmlFor='newJobLocation'>Location</label>
            <input className={css(style.inputBox)} type='text' placeholder='eg: London' id='newJobLocation' required name='location' onChange={this.onChangeGeneric.bind(this)} value={job.location} />
          </li>
          <li className={css(style.formListItem)}>
            <label className={css(style.label)} htmlFor='newJobLabels'>Labels</label>
            <input className={css(style.inputBox)} type='text' placeholder='eg: finance, tech' id='newJobLabels' name='labels' onChange={this.onChangeGeneric.bind(this)} value={job.labels} />
          </li>
          <li className={css(style.formListItem)}>
            <label className={css(style.label)} htmlFor='newJobTemplateTags'>Template tags</label>
            <input className={css(style.inputBox)} type='text' placeholder='eg: food, movies' id='newJobTemplateTags' name='templateTags' onChange={this.onChangeTemplateTags.bind(this)} value={job.templateTags} />
            {errorLabels.templateTagsInvalidLabel}
          </li>
          <li className={css(style.formListItem)}>
            <label className={css(style.label)} htmlFor='newJobRelatedJobs'>Related jobs</label>
            <select className={css(style.selectBoxMultiple)} id='newJobRelatedJobs' name='relatedJobs' multiple onChange={this.onChangeMultiSelect.bind(this)} value={job.relatedJobs}>
              {relatedJobs.map((relatedJob, index) => (<option key={index} value={relatedJob.id}>{relatedJob.title}</option>))}
            </select>
            <button type='button' className={css(style.secondaryButton)} onClick={this.clearRelatedJobs.bind(this)}>Clear all</button>
          </li>
          <li className={css(style.formListItem)}>
            <label className={css(style.label)} htmlFor='tags'>Tags</label>
            <CheckboxGroup
              id='tags'
              name='tags'
              onChange={this.onChangeTags.bind(this)}
              values={job.tags}
              styles={style.tags}
            >
              {
                checkbox => Object.keys(expertiseTags).map(tag => checkbox({
                  id: tag,
                  key: tag,
                  value: tag,
                  label: expertiseTags[tag]
                }))
              }
            </CheckboxGroup>
          </li>
        </ul>
        <div className={css(style.formButtons)}>
          {submitButton}
        </div>
      </div>
    </form>)
  }
}
