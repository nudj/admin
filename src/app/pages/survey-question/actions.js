const get = require('lodash/get')
const actions = require('@nudj/framework/actions')

const quickDispatch = (action) => (dispatch, getState) => dispatch(action)

const SET_SURVEY_QUESTION_DRAFT = 'SET_SURVEY_QUESTION_DRAFT'
module.exports.SET_SURVEY_QUESTION_DRAFT = SET_SURVEY_QUESTION_DRAFT

function setSurveyQuestionDraft (draft) {
  return {
    type: SET_SURVEY_QUESTION_DRAFT,
    draft
  }
}
module.exports.setSurveyQuestionDraft = (draft) => (
  quickDispatch(setSurveyQuestionDraft(draft))
)

function createOrUpdateSurveyQuestion () {
  return (dispatch, getState) => {
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
    let url = '/survey-question/new'

    if (existingId) {
      method = 'patch'
      url = `/survey-question/${existingId}`
    }
    return dispatch(actions.app.postData({ data, url, method }))
  }
}
module.exports.createOrUpdateSurveyQuestion = createOrUpdateSurveyQuestion
