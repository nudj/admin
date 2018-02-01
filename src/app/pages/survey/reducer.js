/* global Draft DraftAction State */
// @flow
const { merge } = require('@nudj/library')
const { SET_SURVEY_DRAFT } = require('./actions')

type Action = {
  type: string,
  draft: Draft
}

type ActionTypes = typeof SET_SURVEY_DRAFT

type Actions = {
  [key: ActionTypes]: (state: State, action: Action) => State
}

const setSurveyDraft = (state: State, action: Action) =>
  merge(state, { draft: action.draft })

const actions = {
  [SET_SURVEY_DRAFT]: setSurveyDraft
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
