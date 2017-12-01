// @flow
const { merge } = require('@nudj/library')

type InitialState = {
  draft: Object
}

const { SET_SURVEY_QUESTION_DRAFT } = require('./actions')

const setSurveyQuestionDraft = (state, action) =>
  merge(state, { draft: action.draft })

const actions = {
  [SET_SURVEY_QUESTION_DRAFT]: setSurveyQuestionDraft
}

const initialState = {
  draft: {}
}

const reducer = (initialState: InitialState, actions: Object) => (
  state: Object = initialState,
  action: Object
) => {
  const { type } = action
  const subreducer = actions[type]
  return subreducer ? subreducer(state, action) : state
}

module.exports = reducer(initialState, actions)
