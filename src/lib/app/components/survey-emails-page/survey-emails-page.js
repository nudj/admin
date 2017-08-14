const React = require('react')
const get = require('lodash/get')
const { Helmet } = require('react-helmet')

const getStyle = require('./survey-emails-page.css')
const PageHeader = require('../page-header/page-header')

module.exports = class SurveyEmailsPage extends React.Component {
  constructor (props) {
    super(props)
    this.style = getStyle()
  }

  render () {
    const surveyMessage = get(this.props, 'surveyMessage')
    const emailSubject = get(surveyMessage, 'subject')
    const hirer = get(surveyMessage, 'hirer')
    const recipient = get(surveyMessage, 'recipient')
    const recipientList = recipient.join(', ')
    const body = get(surveyMessage, 'body')

    return (
      <div className={this.style.pageBody}>
        <Helmet>
          <title>{'nudj - survey email'}</title>
        </Helmet>
        <PageHeader title={'Survey Email'} subtitle={`${hirer}`} />
        <div className={this.style.pageContent}>
          <div className={this.style.pageMain}>
            <h4 className={this.style.pageHeadline}>Subject: {emailSubject}</h4>
            <div className={this.style.formCard}>
              <ul className={this.style.formList}>
                <li className={this.style.formListItem}>
                  Recipients: {recipientList}
                </li>
                <li className={this.style.formListItem}>
                  {body}
                </li>
              </ul>
            </div>
          </div>
          <div className={this.style.pageSidebar} />
        </div>
      </div>
    )
  }
}
