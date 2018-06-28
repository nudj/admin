const React = require('react')
const get = require('lodash/get')
const merge = require('lodash/merge')
const pick = require('lodash/pick')
const getStyle = require('./person-form.css')

const personReset = {
  firstName: '',
  lastName: '',
  email: '',
  url: '',
  role: '',
  company: ''
}
const hirerReset = {
  type: 'MEMBER',
  onboarded: false,
  company: ''
}

module.exports = class PeoplePage extends React.Component {
  constructor (props) {
    super(props)
    this.style = getStyle()
    this.submit = get(props, 'onSubmit')
    const personData = get(props, 'person', {})
    const person = merge({}, this.cleanPerson(), personData, {
      role: get(personData, 'role.name', personReset.role),
      company: get(personData, 'company.name', personReset.company)
    })
    const hirerData = get(props, 'person.hirer', {})
    const hirer = merge({}, this.cleanHirer(), hirerData, {
      company: get(hirerData, 'company.id', hirerReset.company)
    })

    this.state = {
      person,
      hirer
    }
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

    const personForm = this.refs.personForm
    personForm.reset()

    const person = merge({}, this.cleanPerson(), get(this.props, 'person', this.cleanPerson()))
    const validation = this.cleanValidation()

    this.setState({ person, validation })
  }

  cleanPerson () {
    return { ...personReset }
  }

  cleanHirer () {
    return { ...hirerReset }
  }

  cleanValidation () {
    const email = get(this.state, 'person.email', '')
    return {
      email: {
        empty: !email,
        notUnique: !this.isEmailUnique(email)
      }
    }
  }

  onChangeEmail (event) {
    const email = event.target.value

    this.updatePerson({ email })

    const validation = {
      email: {
        empty: !email,
        notUnique: !this.isEmailUnique(email)
      }
    }

    this.updateValidation(validation)
  }

  onChangeGeneric (event) {
    const value = event.target.value
    const key = event.target.name

    this.updatePerson({ [key]: value })
  }

  onChangeNested (event) {
    const value = event.target.value
    const key = event.target.name

    this.updatePerson({
      [key]: {
        name: value
      }
    })
  }

  onHirerChange = event => {
    const value = event.target.value
    const key = event.target.name

    if (key === 'company' && value === '') {
      this.updateHirer(this.cleanHirer())
    } else {
      this.updateHirer({
        [key]: value
      })
    }
  }

  toggleHirerOnboarded = event => {
    this.setState(state => ({
      hirer: {
        ...state.hirer,
        onboarded: !state.hirer.onboarded
      }
    }))
  }

  isPersonValid () {
    const emailEmpty = get(this.state.validation, 'email.empty', false)
    const emailFail = get(this.state.validation, 'email.notUnique', false)

    if (emailEmpty || emailFail) {
      return false
    }

    return true
  }

  isEmailUnique (email) {
    const people = get(this.props, 'people', [])
    const found = people.find(person => get(person, 'email', '').toLowerCase() === email.toLowerCase())
    const existingPersonValue = get(this.props, `person.email`, '').toLowerCase()
    // If it was found, but it also matches the existing person then it's inferred that it's still unique
    return existingPersonValue && found ? existingPersonValue === email.toLowerCase() : !found
  }

  onSubmit (event) {
    event.preventDefault()

    if (!this.isPersonValid()) {
      return false
    }

    const submit = get(this.props, 'onSubmit', () => {})
    const person = get(this.state, 'person', {})
    const hirer = get(this.state, 'hirer')
    const data = {
      person: pick(person, Object.keys(personReset)),
      hirer: hirer.company ? pick(hirer, Object.keys(hirerReset)) : undefined
    }

    submit(data)
  }

  updatePerson (newStuff) {
    const person = merge({}, get(this.state, 'person', {}), newStuff)
    this.setState({ person })
  }

  updateHirer = update => {
    this.setState(state => ({
      hirer: {
        ...state.hirer,
        ...update
      }
    }))
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
      personEmailNotUniqueLabel: (<span />)
    }

    if (get(this.state.validation, 'email.notUnique', false)) {
      errorLabels.personEmailNotUniqueLabel = this.renderErrorLabel('There\'s already another person with this email', 'personEmail')
    }

    return errorLabels
  }

  render () {
    const companies = get(this.props, 'companies', [])
    const person = get(this.state, 'person', {})
    const hirer = get(this.state, 'hirer', {})

    const errorLabels = this.renderErrorLabels()
    const submitLabel = get(this.props, 'submitLabel', 'Add person')
    let submitButton = (<button className={this.style.submitButton}>{submitLabel}</button>)

    if (!this.isPersonValid()) {
      submitButton = (<button className={this.style.submitButton} disabled>{submitLabel}</button>)
    }

    return (<form className={this.style.pageMain} onSubmit={this.onSubmit.bind(this)} ref='personForm'>
      <div className={this.style.formCard}>
        <ul className={this.style.formList}>
          <li className={this.style.formListItem}>
            <label className={this.style.label} htmlFor='personFirstName'>First Name</label>
            <input className={this.style.inputBox} type='text' id='personFirstName' name='firstName' onChange={this.onChangeGeneric.bind(this)} value={person.firstName} required />
          </li>
          <li className={this.style.formListItem}>
            <label className={this.style.label} htmlFor='personLastName'>Last Name</label>
            <input className={this.style.inputBox} type='text' id='personLastName' name='lastName' onChange={this.onChangeGeneric.bind(this)} value={person.lastName} required />
          </li>
          <li className={this.style.formListItem}>
            <label className={this.style.label} htmlFor='personEmail'>Email</label>
            <input className={this.style.inputBox} type='email' id='personEmail' name='email' onChange={this.onChangeEmail.bind(this)} value={person.email} required />
            {errorLabels.personEmailNotUniqueLabel}
          </li>
          <li className={this.style.formListItem}>
            <label className={this.style.label} htmlFor='personUrl'>URL</label>
            <input className={this.style.inputBoxUrl} type='uri' placeholder='eg: https://www.person.com/portfolio' id='personUrl' name='url' onChange={this.onChangeGeneric.bind(this)} value={person.url} />
          </li>
          <li className={this.style.formListItem}>
            <label className={this.style.label} htmlFor='personRole'>Role</label>
            <input className={this.style.inputBox} type='text' id='personRole' name='role' onChange={this.onChangeGeneric.bind(this)} value={person.role} />
          </li>
          <li className={this.style.formListItem}>
            <label className={this.style.label} htmlFor='personCompany'>Company</label>
            <input className={this.style.inputBox} type='text' id='personCompany' name='company' onChange={this.onChangeGeneric.bind(this)} value={person.company} />
          </li>
          <li className={this.style.formListItem}>
            <label
              className={this.style.label}
              htmlFor='hirerCompany'
            >
              Hirer for...
            </label>
            <select
              className={this.style.inputBox}
              type='text'
              id='hirerCompany'
              name='company'
              value={get(hirer, 'company', '')}
              onChange={this.onHirerChange}
            >
              <option value=''>Not a hirer</option>
              {companies.map(company => <option key={company.id} value={company.id}>{company.name}</option>)}
            </select>
          </li>
        </ul>
        { hirer.company && (
          <ul className={this.style.formList}>
            <li className={this.style.formListItem}>
              <label
                className={this.style.label}
                htmlFor='hirerType'
              >
                Permission level
              </label>
              <select
                className={this.style.inputBox}
                type='text'
                id='hirerType'
                name='type'
                value={hirer.type}
                onChange={this.onHirerChange}
              >
                <option value='MEMBER'>Member</option>
                <option value='ADMIN'>Admin</option>
              </select>
            </li>
            <li className={this.style.formListItem}>
              <label
                className={this.style.label}
                htmlFor='onboarded'
              >
                Onboarded?
              </label>
              <input
                type='checkbox'
                id='hirerOnboarded'
                name='onboarded'
                checked={hirer.onboarded}
                onChange={this.toggleHirerOnboarded}
              />
            </li>
          </ul>
        ) }
        <div className={this.style.formButtons}>
          {submitButton}
        </div>
      </div>
    </form>)
  }
}
