const React = require('react')
const { Switch, Route } = require('react-router-dom')
const { Helmet } = require('react-helmet')
const getStyle = require('./index.css')
const Header = require('../header/header')
const Message = require('../message/message')
const Notification = require('../notification/notification')
const CompaniesPage = require('../../../routes/companies/companies-page')
const PeoplePage = require('../../../routes/people/people-page')
const CompanyPage = require('../company-page/company-page')
const SurveyEmailsPage = require('../survey-emails-page/survey-emails-page')
const JobPage = require('../job-page/job-page')
const PersonPage = require('../person-page/person-page')

const PageNotFound = require('../404-page/404-page')
const Overlay = require('../overlay/overlay')
const Status = require('../status/status')
const { PageWithState, WithState } = require('../../lib/with-state')

const Index = () => {
  const style = getStyle()
  return (
    <div className={style.body}>
      <Helmet>
        <meta charSet='utf-8' />
        <title>ADMIN</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta name='title' content='ADMIN' />
        <link rel='icon' href='/assets/images/nudj-square.ico' type='image/x-icon' />
        <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/normalize/7.0.0/normalize.min.css' />
        <link rel='stylesheet' href='/assets/css/reset.css' />
      </Helmet>
      <header className={style.header}>
        <Route path='*' component={WithState(Header)} />
      </header>
      <div className={style.content}>
        <Route path='*' component={WithState(Message)} />
        <Route path='*' component={WithState(Notification)} />
        <Switch>
          <Route exact path='/' component={PageWithState(CompaniesPage)} />
          <Route exact path='/people' component={PageWithState(PeoplePage)} />
          <Route exact path='/people/:personId' component={PageWithState(PersonPage)} />
          <Route exact path='/:companySlug' component={PageWithState(CompanyPage)} />
          <Route exact path='/:companySlug/jobs/:jobSlug' component={PageWithState(JobPage)} />
          <Route exact path='/:companySlug/messages/:surveyMessageId' component={PageWithState(SurveyEmailsPage)} />
          <Route render={PageWithState((props) => <Status code={404}><PageNotFound {...props} /></Status>)} />
        </Switch>
      </div>
      <Route path='*' component={WithState(Overlay)} />
    </div>
  )
}

module.exports = Index
