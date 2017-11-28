const get = require('lodash/get')
const actions = require('@nudj/framework/actions')
const { merge } = require('@nudj/library')

const quickDispatch = (action) => (dispatch, getState) => dispatch(action)

const SET_SURVEY_DRAFT = 'SET_SURVEY_DRAFT'
module.exports.SET_SURVEY_DRAFT = SET_SURVEY_DRAFT

type Company = {
  id: string,
  name?: string
}

type Draft = {
  id?: string | number,
  introTitle?: string,
  outroTitle?: string,
  introDescription?: string,
  outroDescription?: string,
  slug?: string,
  company?: Company,
}

function setSurveyDraft (draft: Draft) {
  return {
    type: SET_SURVEY_DRAFT,
    draft
  }
}
module.exports.setSurveyDraft = (draft) => quickDispatch(setSurveyDraft(draft))

function submitSurvey () {
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
module.exports.submitSurvey = submitSurvey
