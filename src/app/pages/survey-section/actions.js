const get = require('lodash/get')
const actions = require('@nudj/framework/actions')
const { merge } = require('@nudj/library')

const quickDispatch = (action) => (dispatch, getState) => dispatch(action)

const SET_SURVEY_SECTION_DRAFT = 'SET_SURVEY_SECTION_DRAFT'
module.exports.SET_SURVEY_SECTION_DRAFT = SET_SURVEY_SECTION_DRAFT

function setSurveySectionDraft (draft) {
  return {
    type: SET_SURVEY_SECTION_DRAFT,
    draft
  }
}
module.exports.setSurveySectionDraft = (draft) => (
  quickDispatch(setSurveySectionDraft(draft))
)

function submitSurveySection () {
  return (dispatch, getState) => {
    const state = getState()
    const existingId = get(state.app, 'survey.id')
    const draft = get(state, 'surveyPage.draft', {})
    const company = get(draft, 'company', {})

    const data = existingId ? merge(draft, { company: company.id }) : draft

    let method = 'post'
    let url = '/survey/new'

    if (existingId) {
      method = 'patch'
      url = `/survey/${existingId}`
    }
    return dispatch(actions.app.postData({ data, url, method }))
  }
}
module.exports.submitSurveySection = submitSurveySection
