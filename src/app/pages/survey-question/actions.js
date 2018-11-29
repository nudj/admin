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
    const survey = get(state, 'app.survey') || get(state, 'app.question.survey')
    const data = get(state, 'surveyQuestionPage.draft', {})
    const tags = get(state, 'surveyQuestionPage.tags', [])

    let method = 'post'
    let url = `/surveys/${survey.id}/questions/new`

    if (existingId) {
      method = 'patch'
      url = `/surveys/${survey.id}/questions/${existingId}`
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
