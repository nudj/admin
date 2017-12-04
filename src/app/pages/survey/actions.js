/* global Draft Dispatch */
// @flow
const get = require('lodash/get')
const actions = require('@nudj/framework/actions')
const { merge, quickDispatch } = require('@nudj/library')

const SET_SURVEY_DRAFT = 'SET_SURVEY_DRAFT'
module.exports.SET_SURVEY_DRAFT = SET_SURVEY_DRAFT

function setSurveyDraft (draft: Draft) {
  return {
    type: SET_SURVEY_DRAFT,
    draft
  }
}
module.exports.setSurveyDraft = (draft: Draft) => quickDispatch(setSurveyDraft(draft))

function submitSurvey () {
  return (dispatch: Dispatch, getState: Function) => {
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
module.exports.submitSurvey = submitSurvey
