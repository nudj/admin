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
    const readOnly = get(this.props, 'readOnly', false)

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

    return (<form className={css(style.formCard)} onSubmit={this.onSubmit.bind(this)} ref='jobForm'>
      <ul className={css(style.formList)}>
        <li className={css(style.formListItem)}>
          <label className={css(style.label)} htmlFor='newJobTitle'>Title</label>
          {readOnly ? <Text>{job.title}</Text> : <input className={css(style.inputBox)} type='text' id='newJobTitle' name='title' required onChange={this.onChangeTitle.bind(this)} value={job.title} />}
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
          {readOnly ? <Text>{job.url}</Text> : <input className={css(style.inputBoxUrl)} type='uri' placeholder='eg: https://www.company.com/link-to-job' id='newJobUrl' name='url' onChange={this.onChangeGeneric.bind(this)} value={job.url} />}
        </li>
        <li className={css(style.formListItem)}>
          <label className={css(style.label)} htmlFor='newJobBonus'>Bonus</label>
          {readOnly ? <Text>{job.bonus}</Text> : <input className={css(style.inputBox)} type='text' placeholder='eg: £200' id='newJobBonus' name='bonus' required onChange={this.onChangeGeneric.bind(this)} value={job.bonus} />}
        </li>
        <li className={css(style.formListItem)}>
          <label className={css(style.label)} htmlFor='newJobType'>Type</label>
          {readOnly ? <Text>{job.type || types[0]}</Text> : <select className={css(style.selectBox)} id='newJobType' name='type' onChange={this.onChangeGeneric.bind(this)} value={job.type || types[0]}>
            {types.map((type, index) => (<option key={index} value={type}>{type}</option>))}
          </select>}
        </li>
        <li className={css(style.formListItem)}>
          <label className={css(style.label)} htmlFor='newJobStatus'>Status</label>
          {readOnly ? <Text>{job.status || statuses[0]}</Text> : <select className={css(style.selectBox)} id='newJobStatus' name='status' onChange={this.onChangeGeneric.bind(this)} value={job.status || statuses[0]}>
            {statuses.map((status, index) => (<option key={index} value={status}>{status}</option>))}
          </select>}
        </li>
        {!isNil(job.roleDescription) && (
          <li className={css(style.formListItem)}>
            <label className={css(style.label)} htmlFor='newJobRoleDescription'>Role Description (Old)</label>
            {readOnly ? <Text>{job.roleDescription}</Text> : <textarea className={css(style.inputTextarea)} id='newJobRoleDescription' name='roleDescription' required={!descriptionRequired} onChange={this.onChangeGeneric.bind(this)} value={job.roleDescription} />}
          </li>
        )}
        {!isNil(job.candidateDescription) && (
          <li className={css(style.formListItem)}>
            <label className={css(style.label)} htmlFor='newJobDescription'>Candidate Description (Old)</label>
            {readOnly ? <Text>{job.candidateDescription}</Text> : <textarea className={css(style.inputTextarea)} id='newJobCandidateDescription' name='candidateDescription' required={!descriptionRequired} onChange={this.onChangeGeneric.bind(this)} value={job.candidateDescription} />}
          </li>
        )}
        <li className={css(style.formListItem)}>
          <label className={css(style.label)} htmlFor='description'>Description</label>
          {readOnly ? <Text>{job.description}</Text> : <textarea className={css(style.inputTextarea)} id='description' name='description' required={descriptionRequired} onChange={this.onChangeGeneric.bind(this)} value={job.description} />}
        </li>
        <li className={css(style.formListItem)}>
          <label className={css(style.label)} htmlFor='newJobRemuneration'>Remuneration</label>
          {readOnly ? <Text>{job.remuneration}</Text> : <textarea className={css(style.inputTextarea)} id='newJobRemuneration' name='remuneration' onChange={this.onChangeGeneric.bind(this)} value={job.remuneration} />}
        </li>
        <li className={css(style.formListItem)}>
          <label className={css(style.label)} htmlFor='newJobLocation'>Location</label>
          {readOnly ? <Text>{job.location}</Text> : <input className={css(style.inputBox)} type='text' placeholder='eg: London' id='newJobLocation' required name='location' onChange={this.onChangeGeneric.bind(this)} value={job.location} />}
        </li>
        <li className={css(style.formListItem)}>
          <label className={css(style.label)} htmlFor='newJobLabels'>Labels</label>
          {readOnly ? <Text>{job.labels}</Text> : <input className={css(style.inputBox)} type='text' placeholder='eg: finance, tech' id='newJobLabels' name='labels' onChange={this.onChangeGeneric.bind(this)} value={job.labels} />}
        </li>
        <li className={css(style.formListItem)}>
          <label className={css(style.label)} htmlFor='newJobTemplateTags'>Template tags</label>
          {readOnly ? <Text>{job.templateTags}</Text> : <input className={css(style.inputBox)} type='text' placeholder='eg: food, movies' id='newJobTemplateTags' name='templateTags' onChange={this.onChangeTemplateTags.bind(this)} value={job.templateTags} />}
          {errorLabels.templateTagsInvalidLabel}
        </li>
        <li className={css(style.formListItem)}>
          <label className={css(style.label)} htmlFor='newJobRelatedJobs'>Related jobs</label>
          {readOnly ? relatedJobs.map(job => (<Text key={job.id} element='div'>{job.title}</Text>)) : [
            <select key='select' className={css(style.selectBoxMultiple)} id='newJobRelatedJobs' name='relatedJobs' multiple onChange={this.onChangeMultiSelect.bind(this)} value={job.relatedJobs}>
              {relatedJobs.map((relatedJob, index) => (<option key={index} value={relatedJob.id}>{relatedJob.title}</option>))}
            </select>,
            <button key='button' type='button' className={css(style.secondaryButton)} onClick={this.clearRelatedJobs.bind(this)}>Clear all</button>
          ]}
        </li>
        <li className={css(style.formListItem)}>
          <label className={css(style.label)} htmlFor='tags'>Tags</label>
          {readOnly ? <Text>{job.tags.map(tag => expertiseTags[tag]).join(', ')}</Text> : <CheckboxGroup
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
          </CheckboxGroup>}
        </li>
      </ul>
      {!readOnly && <div className={css(style.formButtons)}>
        {submitButton}
      </div>}
    </form>)
  }
}
