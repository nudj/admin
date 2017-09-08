const React = require('react')
const { Switch, Route } = require('react-router-dom')

const PageWithState = require('./page-with-state')
const CompaniesPage = require('../routes/companies/companies-page')
const PeoplePage = require('../routes/people/people-page')
const PersonPage = require('../routes/person/person-page')
const CompanyPage = require('../routes/company/company-page')
const CompanyJobPage = require('../routes/company-job/company-job-page')
const SurveyMessagePage = require('../routes/company-survey-message/company-survey-message-page')
const Status = require('../components/status/status')
const PageNotFound = require('../components/404-page/404-page')

module.exports = () => (
  <Switch>
    <Route exact path='/' component={PageWithState(CompaniesPage)} />
    <Route exact path='/people' component={PageWithState(PeoplePage)} />
    <Route exact path='/people/:personId' component={PageWithState(PersonPage)} />
    <Route exact path='/:companySlug' component={PageWithState(CompanyPage)} />
    <Route exact path='/:companySlug/jobs/:jobSlug' component={PageWithState(CompanyJobPage)} />
    <Route exact path='/:companySlug/messages/:surveyMessageId' component={PageWithState(SurveyMessagePage)} />
    <Route render={PageWithState((props) => <Status code={404}><PageNotFound {...props} /></Status>)} />
  </Switch>
)
