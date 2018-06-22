const React = require('react')
const get = require('lodash/get')
const merge = require('lodash/merge')
const getStyle = require('./company-form.css')

module.exports = class CompanyForm extends React.Component {
  constructor (props) {
    super(props)
    this.style = getStyle()
    this.submit = get(props, 'onSubmit')
    const company = merge({}, this.cleanCompany(), get(props, 'company', this.cleanCompany()))
    this.state = {company}
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

    const companyForm = this.refs.companyForm
    companyForm.reset()

    const company = merge({}, this.cleanCompany(), get(nextProps, 'company', this.cleanCompany()))
    const validation = this.cleanValidation()

    this.setState({ company, validation })
  }

  cleanCompany () {
    return {
      name: '',
      slug: '',
      logo: '',
      description: '',
      location: '',
      url: '',
      client: true
    }
  }

  cleanValidation () {
    const name = get(this.state, 'company.name', '')
    const slug = get(this.state, 'company.slug', '')
    return {
      name: {
        empty: !name,
        notUnique: !this.isNameUnique(name)
      },
      slug: {
        empty: !slug,
        notUnique: !this.isSlugUnique(slug)
      }
    }
  }

  makeSlugFromName (name) {
    return name.toLowerCase()
      .replace(/\s+/g, ' ')
      .replace(/\s/g, '-')
      .replace(/[^a-z0-9-]/g, '')
  }

  onChangeName (event) {
    const name = event.target.value
    const slug = this.makeSlugFromName(name)

    this.updateCompany({ name, slug })

    const validation = {
      name: {
        empty: !name,
        notUnique: !this.isNameUnique(name)
      },
      slug: {
        empty: !slug,
        notUnique: !this.isSlugUnique(slug)
      }
    }

    this.updateValidation(validation)
  }

  onChangeSlug (event) {
    const slug = this.makeSlugFromName(event.target.value)

    this.updateCompany({ slug })

    const validation = {
      slug: {
        empty: !slug,
        notUnique: !this.isSlugUnique(slug)
      }
    }

    this.updateValidation(validation)
  }

  onChangeGeneric (event) {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const key = target.name

    this.updateCompany({ [key]: value })
  }

  isCompanyValid () {
    const nameEmpty = get(this.state.validation, 'name.empty', false)
    const slugEmpty = get(this.state.validation, 'slug.empty', false)

    if (nameEmpty || slugEmpty) {
      return false
    }

    const nameFail = get(this.state.validation, 'name.notUnique', false)
    const slugFail = get(this.state.validation, 'slug.notUnique', false)

    if (nameFail || slugFail) {
      return false
    }

    return true
  }

  isPropUnique (value, propKey) {
    const companies = get(this.props, 'companies', [])
    const found = companies.find(company => get(company, propKey, '').toLowerCase() === value.toLowerCase())
    const existingCompanyValue = get(this.props, `company.${propKey}`, '').toLowerCase()
    // If it was found, but it also matches the existing company then it's inferred that it's still unique
    return existingCompanyValue && found ? existingCompanyValue === value.toLowerCase() : !found
  }

  isNameUnique (name) {
    return this.isPropUnique(name, 'name')
  }

  isSlugUnique (slug) {
    return this.isPropUnique(slug, 'slug')
  }

  onSubmit (event) {
    event.preventDefault()

    if (!this.isCompanyValid()) {
      return false
    }

    const submit = get(this.props, 'onSubmit', () => {})
    const data = get(this.state, 'company', {})

    submit(data)
  }

  updateCompany (newStuff) {
    const company = merge({}, get(this.state, 'company', {}), newStuff)
    this.setState({ company })
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
      companyNameNotUniqueLabel: (<span />),
      companySlugNotUniqueLabel: (<span />)
    }

    if (get(this.state.validation, 'name.notUnique', false)) {
      errorLabels.companyNameNotUniqueLabel = this.renderErrorLabel('There\'s already another company with this name', 'companyName')
    }

    if (get(this.state.validation, 'slug.notUnique', false)) {
      errorLabels.companySlugNotUniqueLabel = this.renderErrorLabel('There\'s already another company with that slug', 'companySlug')
    }

    return errorLabels
  }

  render () {
    const company = get(this.state, 'company', {})

    const errorLabels = this.renderErrorLabels()
    const submitLabel = get(this.props, 'submitLabel', 'Add company')
    let submitButton = (<button className={this.style.submitButton}>{submitLabel}</button>)

    if (!this.isCompanyValid()) {
      submitButton = (<button className={this.style.submitButton} disabled>{submitLabel}</button>)
    }

    return (<form className={this.style.pageMain} onSubmit={this.onSubmit.bind(this)} ref='companyForm'>
      <div className={this.style.formCard}>
        <ul className={this.style.formList}>
          <li className={this.style.formListItem}>
            <label className={this.style.label} htmlFor='companyName'>Name</label>
            <input className={this.style.inputBox} type='text' id='companyName' name='name' onChange={this.onChangeName.bind(this)} value={company.name} />
            {errorLabels.companyNameNotUniqueLabel}
          </li>
          <li className={this.style.formListItem}>
            <label className={this.style.label} htmlFor='companySlug'>Slug</label>
            <input className={this.style.inputBox} type='text' id='companySlug' name='slug' onChange={this.onChangeSlug.bind(this)} value={company.slug} />
            {errorLabels.companySlugNotUniqueLabel}
          </li>
          <li className={this.style.formListItem}>
            <label className={this.style.label} htmlFor='companyLogo'>Logo</label>
            <input className={this.style.inputBoxUrl} type='uri' placeholder='eg: https://www.company.com/logo.png' id='companyLogo' name='logo' onChange={this.onChangeGeneric.bind(this)} value={company.logo} />
          </li>
          <li className={this.style.formListItem}>
            <label className={this.style.label} htmlFor='companyDescription'>Description</label>
            <textarea className={this.style.inputTextarea} id='companyDescription' name='description' onChange={this.onChangeGeneric.bind(this)} value={company.description} />
          </li>
          <li className={this.style.formListItem}>
            <label className={this.style.label} htmlFor='companyLocation'>Location</label>
            <input className={this.style.inputBox} type='text' id='companyLocation' name='location' onChange={this.onChangeGeneric.bind(this)} value={company.location} />
          </li>
          <li className={this.style.formListItem}>
            <label className={this.style.label} htmlFor='companyUrl'>URL</label>
            <input className={this.style.inputBoxUrl} type='uri' placeholder='eg: https://www.company.com' id='companyUrl' name='url' onChange={this.onChangeGeneric.bind(this)} value={company.url} />
          </li>
          <li className={this.style.formListItem}>
            <label className={this.style.label} htmlFor='companyClient'>Client</label>
            <input type='checkbox' id='companyClient' name='client' onChange={this.onChangeGeneric.bind(this)} checked={company.client} disabled />
          </li>
        </ul>
        <div className={this.style.formButtons}>
          {submitButton}
        </div>
      </div>
    </form>)
  }
}
