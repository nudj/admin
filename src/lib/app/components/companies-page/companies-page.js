const React = require('react')
const { Link } = require('react-router-dom')
const get = require('lodash/get')
const merge = require('lodash/merge')
const format = require('date-fns/format')
const differenceInMinutes = require('date-fns/difference_in_minutes')
const { Helmet } = require('react-helmet')
const getStyle = require('./companies-page.css')
const Plural = require('../plural/plural')
const PageHeader = require('../page-header/page-header')
const RowItem = require('../row-item/row-item')
const Tooltip = require('../tooltip/tooltip')
const { postData } = require('../../actions/app')

module.exports = class CompaniesPage extends React.Component {
  constructor (props) {
    super(props)
    this.style = getStyle()
    const validation = this.cleanValidation()
    const company = this.cleanCompany()
    this.state = {company, validation}
  }

  cleanCompany () {
    return {
      name: '',
      slug: '',
      logo: '',
      description: '',
      industry: '',
      url: '',
      facebook: '',
      twitter: '',
      linkedin: ''
    }
  }

  cleanValidation () {
    return {
      name: {
        empty: !get(this.state, 'company.name', '')
      },
      slug: {
        empty: !get(this.state, 'company.slug', '')
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

    const companies = get(this.props, 'companies', [])
    const validation = {
      name: {
        empty: !name,
        notUnique: !!(companies.find(company => company.name.toLowerCase() === name.toLowerCase()))
      },
      slug: {
        empty: !slug,
        notUnique: !!(companies.find(company => company.slug.toLowerCase() === slug.toLowerCase()))
      }
    }

    this.updateValidation(validation)
  }

  onChangeSlug (event) {
    const slug = this.makeSlugFromName(event.target.value)

    this.updateCompany({ slug })

    const companies = get(this.props, 'companies', [])
    const validation = {
      slug: {
        empty: !slug,
        notUnique: !!(companies.find(company => company.slug.toLowerCase() === slug.toLowerCase()))
      }
    }

    this.updateValidation(validation)
  }

  onChangeGeneric (event) {
    const value = event.target.value
    const key = event.target.name

    this.updateCompany({ [key]: value })
  }

  isNewCompanyValid () {
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

  onSubmit (event) {
    event.preventDefault()

    if (!this.isNewCompanyValid()) {
      return false
    }

    const url = '/'
    const method = 'post'
    const data = get(this.state, 'company', {})

    this.setState({
      company: this.cleanCompany(),
      validation: this.cleanValidation()
    }, () => this.props.dispatch(postData({ url, data, method })))
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
      errorLabels.companyNameNotUniqueLabel = this.renderErrorLabel('There\'s already another company with this name', 'newCompanyName')
    }

    if (get(this.state.validation, 'slug.notUnique', false)) {
      errorLabels.companySlugNotUniqueLabel = this.renderErrorLabel('There\'s already another company with that slug', 'newCompanySlug')
    }

    return errorLabels
  }

  renderAddCompanyForm () {
    const company = get(this.state, 'company', {})

    const errorLabels = this.renderErrorLabels()
    let submitButton = (<button className={this.style.submitButton}>Add company</button>)

    if (!this.isNewCompanyValid()) {
      submitButton = (<button className={this.style.submitButton} disabled>Add company</button>)
    }

    return (<form className={this.style.pageMain} onSubmit={this.onSubmit.bind(this)}>
      <div className={this.style.formCard}>
        <ul className={this.style.formList}>
          <li className={this.style.formListItem}>
            <label className={this.style.label} htmlFor='newCompanyName'>Name</label>
            <input className={this.style.inputBox} type='text' id='newCompanyName' name='name' onChange={this.onChangeName.bind(this)} value={company.name} />
            {errorLabels.companyNameNotUniqueLabel}
          </li>
          <li className={this.style.formListItem}>
            <label className={this.style.label} htmlFor='newCompanySlug'>Slug</label>
            <input className={this.style.inputBox} type='text' id='newCompanySlug' name='slug' onChange={this.onChangeSlug.bind(this)} value={company.slug} />
            {errorLabels.companySlugNotUniqueLabel}
          </li>
          <li className={this.style.formListItem}>
            <label className={this.style.label} htmlFor='newCompanyLogo'>Logo</label>
            <input className={this.style.inputBox} type='uri' placeholder='https://www.company.com/logo.png' id='newCompanyLogo' name='logo' onChange={this.onChangeGeneric.bind(this)} />
          </li>
          <li className={this.style.formListItem}>
            <label className={this.style.label} htmlFor='newCompanyDescription'>Description</label>
            <textarea className={this.style.inputTextarea} id='newCompanyDescription' name='description' onChange={this.onChangeGeneric.bind(this)} />
          </li>
          <li className={this.style.formListItem}>
            <label className={this.style.label} htmlFor='newCompanyIndustry'>Industry</label>
            <input className={this.style.inputBox} type='text' id='newCompanyIndustry' name='industry' onChange={this.onChangeGeneric.bind(this)} />
          </li>
          <li className={this.style.formListItem}>
            <label className={this.style.label} htmlFor='newCompanyUrl'>URL</label>
            <input className={this.style.inputBox} type='uri' placeholder='https://www.company.com' id='newCompanyUrl' name='url' onChange={this.onChangeGeneric.bind(this)} />
          </li>
          <li className={this.style.formListItem}>
            <h4 className={this.style.formListItemHeading}>Social</h4>
          </li>
          <li className={this.style.formListItem}>
            <label className={this.style.label} htmlFor='newCompanyFacebook'>Facebook</label>
            <input className={this.style.inputBox} type='uri' placeholder='https://facebook.com/company' id='newCompanyFacebook' name='facebook' onChange={this.onChangeGeneric.bind(this)} />
          </li>
          <li className={this.style.formListItem}>
            <label className={this.style.label} htmlFor='newCompanyTwitter'>Twitter</label>
            <input className={this.style.inputBox} type='uri' placeholder='https://twitter.com/company' id='newCompanyTwitter' name='twitter' onChange={this.onChangeGeneric.bind(this)} />
          </li>
          <li className={this.style.formListItem}>
            <label className={this.style.label} htmlFor='newCompanyLinkedIn'>LinkedIn</label>
            <input className={this.style.inputBox} type='uri' placeholder='https://linkedin.com/company' id='newCompanyLinkedIn' name='linkedin' onChange={this.onChangeGeneric.bind(this)} />
          </li>
        </ul>
        <div className={this.style.formButtons}>
          {submitButton}
        </div>
      </div>
    </form>)
  }

  render () {
    const companies = get(this.props, 'companies', [])
    const tooltip = get(this.props, 'tooltip')
    const addCompanyForm = this.renderAddCompanyForm()

    const rightNow = new Date()

    return (
      <div className={this.style.pageBody}>
        <Helmet>
          <title>nudj - Companies</title>
        </Helmet>
        <PageHeader title='Companies' />
        <h3 className={this.style.pageHeadline}>{companies.length} <Plural count={companies.length} singular='company' plural='companies' /> listed on nudj...</h3>
        <div className={this.style.pageContent}>
          <div className={this.style.pageMain}>
            <ul className={this.style.jobs}>
              {companies.map((company) => {
                const minutes = differenceInMinutes(rightNow, get(company, 'created'))
                const rowClass = minutes < 10 ? 'rowHighlight' : 'row'

                return (<RowItem
                  key={get(company, 'slug')}
                  rowClass={rowClass}
                  title={get(company, 'name')}
                  details={[{
                    term: 'Industry',
                    description: get(company, 'industry')
                  }, {
                    term: 'Location',
                    description: get(company, 'location')
                  }, {
                    term: 'Added',
                    description: format(get(company, 'created'), 'DD.MM.YYYY')
                  }]}
                  actions={[
                    <Link className={this.style.nudj} to={`/${get(company, 'slug')}/jobs`}>Nudjy nudjy nudj nudj</Link>
                  ]}
                />)
              })}
            </ul>
          </div>
          <div className={this.style.pageSidebar}>
            {tooltip ? <Tooltip {...tooltip} /> : ''}
          </div>
        </div>
        <h4 className={this.style.pageHeadline}>Add another company</h4>
        <div className={this.style.pageContent}>
          {addCompanyForm}
          <div className={this.style.pageSidebar} />
        </div>
      </div>
    )
  }
}
