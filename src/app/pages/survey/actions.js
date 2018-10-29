const get = require('lodash/get')
const actions = require('@nudj/framework/actions')
const { merge, quickDispatch } = require('@nudj/library')

const SET_SURVEY_DRAFT = 'SET_SURVEY_DRAFT'

function setSurveyDraft (draft) {
  return quickDispatch({
    type: SET_SURVEY_DRAFT,
    draft
  })
}

function submitSurvey () {
  return (dispatch, getState) => {
    const state = getState()
    const existingId = get(state.app, 'survey.id')
    const draft = get(state, 'surveyPage.draft', {})
    const company = get(draft, 'company', {})

    const data = existingId ? merge(draft, { company: company.id }) : draft

    let method = 'post'
    let url = '/surveys/new'

    if (existingId) {
      method = 'patch'
      url = `/surveys/${existingId}`
    }
    return dispatch(actions.app.postData({ data, url, method }))
  }
}

module.exports = {
  // actions
  submitSurvey,
  setSurveyDraft,
  // constants
  SET_SURVEY_DRAFT
}
