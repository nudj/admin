const React = require('react')
const get = require('lodash/get')
const { Helmet } = require('react-helmet')
const EmailForm = require('@nudj/components/lib/email-form/email-form')

const getStyle = require('./survey-emails-page.css')
const PageHeader = require('../page-header/page-header')
const { cssProcessor } = require('../../lib/css')

module.exports = (props) => {
  const style = getStyle()
  const surveyMessage = get(props, 'surveyMessage')
  const emailSubject = get(surveyMessage, 'subject')
  const hirer = get(surveyMessage, 'hirer')
  const recipients = get(surveyMessage, 'recipients', [])
  const recipientsList = recipients.join(', ')
  const body = get(surveyMessage, 'body')

  return (
    <div className={style.pageBody}>
      <Helmet>
        <title>nudj - survey email</title>
      </Helmet>
      <PageHeader title='Survey Email' subtitle={hirer} />
      <div className={style.pageContent}>
        <div className={style.pageMain}>
          <EmailForm
            css={cssProcessor}
            renderMessage={message => message}
            recipients={recipientsList}
            subject={emailSubject}
            template={body}
          />
        </div>
        <div className={style.pageSidebar} />
      </div>
    </div>
  )
}
