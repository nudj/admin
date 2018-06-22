const React = require('react')
const { Link } = require('react-router-dom')
const get = require('lodash/get')
const format = require('date-fns/format')
const differenceInMinutes = require('date-fns/difference_in_minutes')
const { Helmet } = require('react-helmet')
const actions = require('@nudj/framework/actions')

const getStyle = require('./style.css')
const Page = require('../../components/page')
const RowItem = require('../../components/row-item')
const Tooltip = require('../../components/tooltip')
const CompanyForm = require('../../components/company-form')
const Plural = require('../../components/plural')

module.exports = class CompaniesPage extends React.Component {
  constructor (props) {
    super(props)
    this.style = getStyle()
    const resetForm = false
    this.state = { resetForm }
  }

  componentWillReceiveProps (nextProps) {
    const resetForm = !!get(nextProps, 'newCompany')
    if (resetForm === this.state.resetForm) {
      return
    }
    this.setState({ resetForm })
  }

  onSubmit (data) {
    const url = '/'
    const method = 'post'

    this.props.dispatch(actions.app.postData({ url, data, method }))
  }

  render () {
    const clientCompanies = get(this.props, 'clientCompanies', [])
    const companies = get(this.props, 'companies', [])
    const tooltip = get(this.props, 'tooltip')

    const addCompanyForm = (<CompanyForm
      companies={companies}
      reset={this.state.resetForm}
      onSubmit={this.onSubmit.bind(this)} />)

    const rightNow = new Date()

    return (
      <Page
        {...this.props}
        title='Companies'
      >
        <Helmet>
          <title>ADMIN - Clients</title>
        </Helmet>
        <h3 className={this.style.pageHeadline}>Clients <span className={this.style.textHighlight}>({clientCompanies.length})</span></h3>
        <div className={this.style.pageContent}>
          <div className={this.style.pageMain}>
            <ul className={this.style.jobs}>
              {clientCompanies.map((company) => {
                const minutes = differenceInMinutes(rightNow, get(company, 'created'))
                const rowClass = minutes < 10 ? 'rowHighlight' : 'row'
                return (<RowItem
                  key={get(company, 'slug')}
                  rowClass={rowClass}
                  title={get(company, 'name')}
                  details={[{
                    term: 'Location',
                    description: get(company, 'location')
                  }, {
                    term: 'Added',
                    description: format(get(company, 'created'), 'DD.MM.YYYY')
                  }]}
                  actions={[
                    <Link className={this.style.nudj} to={`/companies/${get(company, 'slug')}`}>View company</Link>
                  ]}
                />)
              })}
            </ul>
          </div>
          <div className={this.style.pageSidebar}>
            {tooltip ? <Tooltip {...tooltip} /> : ''}
          </div>
        </div>
        <h4 className={this.style.pageHeadline}>Add <Plural zero='a' singular='another' count={clientCompanies.length} /> company</h4>
        <div className={this.style.pageContent}>
          {addCompanyForm}
          <div className={this.style.pageSidebar} />
        </div>
      </Page>
    )
  }
}
