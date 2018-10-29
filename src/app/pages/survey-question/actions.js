const get = require('lodash/get')
const actions = require('@nudj/framework/actions')
const { quickDispatch } = require('@nudj/library')

const SET_SURVEY_QUESTION_DRAFT = 'SET_SURVEY_QUESTION_DRAFT'
const SET_SURVEY_QUESTION_TAGS = 'SET_SURVEY_QUESTION_TAGS'

function setSurveyQuestionDraft (draft) {
  return quickDispatch({
    type: SET_SURVEY_QUESTION_DRAFT,
    draft
  })
}

function setSurveyQuestionTags (tags) {
  return quickDispatch({
    type: SET_SURVEY_QUESTION_TAGS,
    tags
  })
}

function createOrUpdateSurveyQuestion () {
  return (dispatch, getState) => {
    const state = getState()
    const existingId = get(state, 'app.question.id')
    const data = get(state, 'surveyQuestionPage.draft', {})
    const tags = get(state, 'surveyQuestionPage.tags', [])
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
    return dispatch(actions.app.postData({
      data: {
        ...data,
        tags
      },
      url,
      method
    }))
  }
}

module.exports = {
  // actions
  setSurveyQuestionDraft,
  setSurveyQuestionTags,
  createOrUpdateSurveyQuestion,
  // constants
  SET_SURVEY_QUESTION_DRAFT,
  SET_SURVEY_QUESTION_TAGS
}
