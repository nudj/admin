/* global Dispatch */
// @flow
const get = require('lodash/get')
const actions = require('@nudj/framework/actions')

const quickDispatch = (action: Object) => (dispatch: Dispatch, getState: Function) => dispatch(action)

const SET_SURVEY_SECTION_DRAFT = 'SET_SURVEY_SECTION_DRAFT'
module.exports.SET_SURVEY_SECTION_DRAFT = SET_SURVEY_SECTION_DRAFT

function setSurveySectionDraft (draft: Object) {
  return {
    type: SET_SURVEY_SECTION_DRAFT,
    draft
  }
}
module.exports.setSurveySectionDraft = (draft: Object) => (
  quickDispatch(setSurveySectionDraft(draft))
)

function createOrUpdateSurveySection () {
  return (dispatch: Dispatch, getState: Function) => {
    const state = getState()
    const existingId = get(state.app, 'section.id')
    const data = get(state, 'surveySectionPage.draft', {})

    let method = 'post'
    let url = '/survey-section/new'

    if (existingId) {
      method = 'patch'
      url = `/survey-section/${existingId}`
    }
    return dispatch(actions.app.postData({ data, url, method }))
  }
}
module.exports.createOrUpdateSurveySection = createOrUpdateSurveySection
