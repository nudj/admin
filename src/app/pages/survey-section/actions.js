/* global Dispatch GetState Draft */
// @flow
const get = require('lodash/get')
const omit = require('lodash/omit')
const actions = require('@nudj/framework/actions')
const { quickDispatch } = require('@nudj/library')

const SET_SURVEY_SECTION_DRAFT = 'SET_SURVEY_SECTION_DRAFT'
module.exports.SET_SURVEY_SECTION_DRAFT = SET_SURVEY_SECTION_DRAFT

function setSurveySectionDraft (draft: Draft) {
  return {
    type: SET_SURVEY_SECTION_DRAFT,
    draft
  }
}
module.exports.setSurveySectionDraft = (draft: Draft) => (
  quickDispatch(setSurveySectionDraft(draft))
)

function createOrUpdateSurveySection () {
  return (dispatch: Dispatch, getState: GetState) => {
    const state = getState()
    const existingId = get(state.app, 'section.id')

    let method = 'post'
    let url = '/survey-sections/new'
    let data = get(state, 'surveySectionPage.draft', {})

    if (existingId) {
      method = 'patch'
      url = `/survey-sections/${existingId}`
      data = omit(data, ['survey'])
    }
    return dispatch(actions.app.postData({ data, url, method }))
  }
}
module.exports.createOrUpdateSurveySection = createOrUpdateSurveySection
