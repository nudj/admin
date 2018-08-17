const React = require('react')
const get = require('lodash/get')
const merge = require('lodash/merge')

const getStyle = require('./company-form.css')
const CopyToClipboard = require('../copy-to-clipboard')

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
      mission: '',
      description: '',
      industry: '',
      location: '',
      url: '',
      facebook: '',
      twitter: '',
      linkedin: '',
      onboarded: false
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
    const existingCompany = !!(company.id)
    const { invitationLink } = company

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
            <label className={this.style.label} htmlFor='mission'>Mission</label>
            <input className={this.style.inputBox} type='text' id='mission' name='mission' onChange={this.onChangeGeneric.bind(this)} value={company.mission} />
          </li>
          <li className={this.style.formListItem}>
            <label className={this.style.label} htmlFor='companyIndustry'>Industry</label>
            <input className={this.style.inputBox} type='text' id='companyIndustry' name='industry' onChange={this.onChangeGeneric.bind(this)} value={company.industry} />
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
            <h4 className={this.style.formListItemHeading}>Social</h4>
          </li>
          <li className={this.style.formListItem}>
            <label className={this.style.label} htmlFor='companyFacebook'>Facebook</label>
            <input className={this.style.inputBoxUrl} type='uri' placeholder='eg: https://facebook.com/company' id='companyFacebook' name='facebook' onChange={this.onChangeGeneric.bind(this)} value={company.facebook} />
          </li>
          <li className={this.style.formListItem}>
            <label className={this.style.label} htmlFor='companyTwitter'>Twitter</label>
            <input className={this.style.inputBoxUrl} type='uri' placeholder='eg: https://twitter.com/company' id='companyTwitter' name='twitter' onChange={this.onChangeGeneric.bind(this)} value={company.twitter} />
          </li>
          <li className={this.style.formListItem}>
            <label className={this.style.label} htmlFor='companyLinkedIn'>LinkedIn</label>
            <input className={this.style.inputBoxUrl} type='uri' placeholder='eg: https://linkedin.com/company' id='companyLinkedIn' name='linkedin' onChange={this.onChangeGeneric.bind(this)} value={company.linkedin} />
          </li>
          <li className={this.style.formListItem}>
            <label className={this.style.label} htmlFor='companyOnboarded'>Onboarded</label>
            <input type='checkbox' id='companyOnboarded' name='onboarded' onChange={this.onChangeGeneric.bind(this)} checked={company.onboarded} />
          </li>
          {existingCompany && (
            <li className={this.style.formListItem}>
              <label className={this.style.label} htmlFor='companyOnboarded'>Invitation Link</label>
              <input className={this.style.inputBoxUrl} type='url' id='invitation-link' name='invitation-link' value={invitationLink} disabled />
              <CopyToClipboard className={this.style.secondaryButton} data-clipboard-text={invitationLink}>Copy invitation link</CopyToClipboard>
            </li>
          )}
        </ul>
        <div className={this.style.formButtons}>
          {submitButton}
        </div>
      </div>
    </form>)
  }
}
