const React = require('react')
const { Link } = require('react-router-dom')
const get = require('lodash/get')
const format = require('date-fns/format')
const differenceInMinutes = require('date-fns/difference_in_minutes')
const { Helmet } = require('react-helmet')

const getStyle = require('./companies-page.css')
const Page = require('../../components/page')
const PageHeader = require('../../components/page-header')
const RowItem = require('../../components/row-item')
const Tooltip = require('../../components/tooltip')
const CompanyForm = require('../../components/company-form')
const Plural = require('../../components/plural')
const { postData } = require('../../redux/actions/app')

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

    this.props.dispatch(postData({ url, data, method }))
  }

  render () {
    const companies = get(this.props, 'companies', [])
    const tooltip = get(this.props, 'tooltip')

    const addCompanyForm = (<CompanyForm
      companies={companies}
      reset={this.state.resetForm}
      onSubmit={this.onSubmit.bind(this)} />)

    const rightNow = new Date()

    return (
      <Page {...this.props} className={this.style.pageBody}>
        <Helmet>
          <title>ADMIN - Companies</title>
        </Helmet>
        <PageHeader title='Companies' />
        <h3 className={this.style.pageHeadline}>Companies listed on nudj <span className={this.style.textHighlight}>({companies.length})</span></h3>
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
                    <Link className={this.style.nudj} to={`/${get(company, 'slug')}`}>See jobs</Link>
                  ]}
                />)
              })}
            </ul>
          </div>
          <div className={this.style.pageSidebar}>
            {tooltip ? <Tooltip {...tooltip} /> : ''}
          </div>
        </div>
        <h4 className={this.style.pageHeadline}>Add <Plural zero='a' singular='another' count={companies.length} /> company</h4>
        <div className={this.style.pageContent}>
          {addCompanyForm}
          <div className={this.style.pageSidebar} />
        </div>
      </Page>
    )
  }
}
