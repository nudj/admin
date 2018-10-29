const PropTypes = require('@nudj/components/prop-types')

const Company = PropTypes.shape({
  id: PropTypes.id,
  name: PropTypes.string
})

const Draft = PropTypes.shape({
  intro: PropTypes.string,
  outro: PropTypes.string,
  introDescription: PropTypes.string,
  outroDescription: PropTypes.string,
  slug: PropTypes.string
})

const Survey = PropTypes.shape({
  id: PropTypes.id,
  introTitle: PropTypes.string,
  outroTitle: PropTypes.string,
  outroDescription: PropTypes.string,
  introDescription: PropTypes.string,
  slug: PropTypes.string,
  company: Company,
  surveySections: PropTypes.arrayOf(PropTypes.id)
})

const SurveySection = PropTypes.shape({
  id: PropTypes.id,
  created: PropTypes.date,
  modified: PropTypes.date,
  survey: Survey,
  title: PropTypes.string,
  description: PropTypes.string,
  questions: PropTypes.arrayOf(PropTypes.id),
  surveyQuestions: PropTypes.arrayOf(PropTypes.id)
})

const SurveyQuestion = PropTypes.shape({
  id: PropTypes.id,
  created: PropTypes.date,
  modified: PropTypes.date,
  surveySection: SurveySection,
  section: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string
  }),
  title: PropTypes.string,
  description: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  required: PropTypes.boolean,
  tags: PropTypes.arrayOf(PropTypes.id)
})

const Location = PropTypes.shape({
  pathname: PropTypes.string,
  search: PropTypes.string,
  hashname: PropTypes.string,
  key: PropTypes.string
})

const AppState = PropTypes.shape({
  app: PropTypes.object,
  router: PropTypes.object,
  surveyPage: PropTypes.shape({
    draft: Draft
  }),
  surveyQuestionPage: PropTypes.shape({
    draft: Draft
  }),
  surveyRelationsPage: PropTypes.shape({
    order: PropTypes.object
  }),
  surveySectionRelationsPage: PropTypes.shape({
    order: PropTypes.object
  })
})

const DraftAction = PropTypes.shape({
  type: PropTypes.string,
  draft: Draft
})

module.exports = {
  ...PropTypes,
  Company,
  Draft,
  Survey,
  SurveySection,
  SurveyQuestion,
  Location,
  AppState,
  DraftAction
}
