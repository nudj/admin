const React = require('react')
const get = require('lodash/get')
const { Helmet } = require('react-helmet')
const getStyle = require('./person-page.css')
const PageHeader = require('../page-header/page-header')
const PersonForm = require('../person-form/person-form')
const { postData } = require('../../actions/app')

module.exports = class CompaniesPage extends React.Component {
  constructor (props) {
    super(props)
    this.style = getStyle()
    const resetForm = false
    this.state = { resetForm }
  }

  componentWillReceiveProps (nextProps) {
    const resetForm = !!get(nextProps, 'savedPerson')
    if (resetForm === this.state.resetForm) {
      return
    }
    this.setState({ resetForm })
  }

  onSubmit (data) {
    const url = `/people/${data.id}`
    const method = 'put'

    this.props.dispatch(postData({ url, data, method }))
  }

  render () {
    const people = get(this.props, 'people', [])
    const person = get(this.props, 'person', {})

    const personName = `${get(person, 'firstName', '')} ${get(person, 'lastName', '')}`

    const editPersonForm = (<PersonForm
      people={people}
      person={person}
      reset={this.state.resetForm}
      onSubmit={this.onSubmit.bind(this)}
      submitLabel='Save changes' />)

    return (
      <div className={this.style.pageBody}>
        <Helmet>
          <title>{`nudj - ${personName}`}</title>
        </Helmet>
        <PageHeader title={personName}>
          <h4>{get(this.props, 'person.email')}</h4>
        </PageHeader>
        <div className={this.style.pageContent}>
          {editPersonForm}
        </div>
      </div>
    )
  }
}
