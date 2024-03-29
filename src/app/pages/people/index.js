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
const PersonForm = require('../../components/person-form')
const Plural = require('../../components/plural')

module.exports = class PeoplePage extends React.Component {
  constructor (props) {
    super(props)
    this.style = getStyle()
    const resetForm = false
    this.state = { resetForm }
  }

  componentWillReceiveProps (nextProps) {
    const resetForm = !!get(nextProps, 'newPerson')
    if (resetForm === this.state.resetForm) {
      return
    }
    this.setState({ resetForm })
  }

  onSubmit (data) {
    const url = '/people/'
    const method = 'post'

    this.props.dispatch(actions.app.postData({ url, data, method }))
  }

  renderPeopleList () {
    const people = get(this.props, 'people', [])
    const rightNow = new Date()
    return (<div className={this.style.pageMain}>
      <ul className={this.style.jobs}>
        {people.map((person) => {
          const minutes = differenceInMinutes(rightNow, get(person, 'created'))
          const rowClass = minutes < 10 ? 'rowHighlight' : 'row'

          return (<RowItem
            key={get(person, 'id')}
            rowClass={rowClass}
            title={`${get(person, 'firstName')} ${get(person, 'lastName')}`}
            details={[{
              term: 'Email',
              description: get(person, 'email')
            }, {
              term: 'Added',
              description: format(get(person, 'created'), 'DD.MM.YYYY')
            }]}
            actions={[
              <Link className={this.style.nudj} to={`/people/${get(person, 'id')}`}>See person</Link>
            ]}
          />)
        })}
      </ul>
    </div>)
  }

  render () {
    const companies = get(this.props, 'companies', [])
    const people = get(this.props, 'people', [])
    const tooltip = get(this.props, 'tooltip')

    const addPersonForm = (<PersonForm
      people={people}
      reset={this.state.resetForm}
      onSubmit={this.onSubmit.bind(this)}
      companies={companies}
      isHirer />)

    const peopleList = this.renderPeopleList()

    return (
      <Page
        {...this.props}
        title='People'
      >
        <Helmet>
          <title>ADMIN - People</title>
        </Helmet>
        <h3 className={this.style.pageHeadline}>Hirers on nudj <span className={this.style.textHighlight}>({people.length})</span></h3>
        <div className={this.style.pageContent}>
          {peopleList}
          <div className={this.style.pageSidebar}>
            {tooltip ? <Tooltip {...tooltip} /> : ''}
          </div>
        </div>
        <h4 className={this.style.pageHeadline}>Add <Plural zero='a' singular='another' count={people.length} /> user</h4>
        <div className={this.style.pageContent}>
          {addPersonForm}
          <div className={this.style.pageSidebar} />
        </div>
      </Page>
    )
  }
}
