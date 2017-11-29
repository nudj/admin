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
    const existingId = get(state.app, 'section.id')
    const draft = get(state, 'surveySectionPage.draft', {})
    const survey = get(draft, 'survey', {})

    const data = existingId ? merge(draft, { survey: survey.id }) : draft
    let method = 'post'
    let url = '/survey-section/new'

    if (existingId) {
      method = 'patch'
      url = `/survey-section/${existingId}`
    }
    return dispatch(actions.app.postData({ data, url, method }))
  }
}
module.exports.submitSurveySection = submitSurveySection
