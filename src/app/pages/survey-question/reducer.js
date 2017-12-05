/* global DraftAction State */
// @flow
const { merge } = require('@nudj/library')
const { SET_SURVEY_QUESTION_DRAFT } = require('./actions')

type Actions = {
  [key: typeof SET_SURVEY_QUESTION_DRAFT]: (
    state: State,
    action: DraftAction
  ) => Object
}

const setSurveyQuestionDraft = (state, action) =>
  merge(state, { draft: action.draft })

const actions = {
  [SET_SURVEY_QUESTION_DRAFT]: setSurveyQuestionDraft
}

const initialState = {
  draft: {}
}

const reducer = (initialState: State, actions: Actions) => (
  state: State = initialState,
  action: DraftAction
) => {
  const { type } = action
  const subreducer = actions[type]
  return subreducer ? subreducer(state, action) : state
}

module.exports = reducer(initialState, actions)
