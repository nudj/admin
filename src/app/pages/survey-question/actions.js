/* global Dispatch Draft GetState */
// @flow
const get = require('lodash/get')
const actions = require('@nudj/framework/actions')
const { quickDispatch } = require('@nudj/library')

const SET_SURVEY_QUESTION_DRAFT = 'SET_SURVEY_QUESTION_DRAFT'
module.exports.SET_SURVEY_QUESTION_DRAFT = SET_SURVEY_QUESTION_DRAFT

function setSurveyQuestionDraft (draft: Draft) {
  return {
    type: SET_SURVEY_QUESTION_DRAFT,
    draft
  }
}
module.exports.setSurveyQuestionDraft = (draft: Draft) => (
  quickDispatch(setSurveyQuestionDraft(draft))
)

function createOrUpdateSurveyQuestion () {
  return (dispatch: Dispatch, getState: GetState) => {
    const state = getState()
    const existingId = get(state, 'app.question.id')
    const data = get(state, 'surveyQuestionPage.draft', {})
    const questions = get(state, 'app.surveyQuestions', [])
    const names = questions.map(question => question.name)

    if (names.includes(data.name) && !existingId) {
      const notification = { type: 'error', message: 'Please choose a unique name' }
      return dispatch(actions.app.showNotification(notification))
    }

    let method = 'post'
    let url = '/survey-questions/new'

    if (existingId) {
      method = 'patch'
      url = `/survey-questions/${existingId}`
    }
    return dispatch(actions.app.postData({ data, url, method }))
  }
}
module.exports.createOrUpdateSurveyQuestion = createOrUpdateSurveyQuestion
