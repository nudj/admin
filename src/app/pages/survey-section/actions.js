const get = require('lodash/get')
const actions = require('@nudj/framework/actions')
const { quickDispatch } = require('@nudj/library')

const SET_SURVEY_SECTION_DRAFT = 'SET_SURVEY_SECTION_DRAFT'

function setSurveySectionDraft (draft) {
  return quickDispatch({
    type: SET_SURVEY_SECTION_DRAFT,
    draft
  })
}

function createOrUpdateSurveySection () {
  return (dispatch, getState) => {
    const state = getState()
    const existingId = get(state.app, 'section.id')
    const data = get(state, 'surveySectionPage.draft', {})

    let method = 'post'
    let url = '/survey-sections/new'

    if (existingId) {
      method = 'patch'
      url = `/survey-sections/${existingId}`
    }
    return dispatch(actions.app.postData({ data, url, method }))
  }
}

module.exports = {
  // actions
  createOrUpdateSurveySection,
  setSurveySectionDraft,
  // constants
  SET_SURVEY_SECTION_DRAFT
}
