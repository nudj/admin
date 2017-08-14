const React = require('react')
const { Switch, Route } = require('react-router-dom')
const { Helmet } = require('react-helmet')
const getStyle = require('./index.css')
const Header = require('../header/header')
const Message = require('../message/message')
const Notification = require('../notification/notification')
const CompaniesPage = require('../companies-page/companies-page')
const JobsPage = require('../jobs-page/jobs-page')
const SurveyEmailsPage = require('../survey-emails-page/survey-emails-page')
const JobPage = require('../job-page/job-page')
const PeoplePage = require('../people-page/people-page')
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
        <title>nudj</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta name='description' content='With your help, nudj connects the best companies with the best people, without any of the faff.' />
        <meta name='title' content='nudj - Stop looking. Start hiring.' />
        <meta property='og:description' content='With your help, we connect the best companies with the best people, without any of the faff.' />
        <meta property='twitter:description' content='With your help, we connect the best companies with the best people, without any of the faff.' />
        <meta property='og:type' content='article' />
        <meta property='og:title' content='nudj - Stop looking. Start hiring.' />
        <meta property='twitter:card' content='nudj - Stop looking. Start hiring.' />
        <meta property='twitter:title' content='nudj - Stop looking. Start hiring.' />
        <meta property='og:site_name' content='nudj - Stop looking. Start hiring.' />
        <meta property='twitter:image' content='' />
        <meta property='og:image' content='' />
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
          <Route exact path='/:companySlug/jobs' component={PageWithState(JobsPage)} />
          <Route exact path='/:companySlug/jobs/:jobSlug' component={PageWithState(JobPage)} />
          <Route exact path='/people' component={PageWithState(PeoplePage)} />
          <Route exact path='/people/:personId' component={PageWithState(PersonPage)} />
          <Route exact path='/message/:surveyMessageId' component={PageWithState(SurveyEmailsPage)} />
          <Route render={PageWithState((props) => <Status code={404}><PageNotFound {...props} /></Status>)} />
        </Switch>
      </div>
      <Route path='*' component={WithState(Overlay)} />
    </div>
  )
}

module.exports = Index
