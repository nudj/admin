/* global Draft DraftAction State */
// @flow
const { merge } = require('@nudj/library')
const { SET_SURVEY_DRAFT } = require('./actions')

const ROUTER_LOCATION_CHANGE = '@@router/LOCATION_CHANGE'

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

const handleLocationChange = () => {
  return initialState
}

const actions = {
  [SET_SURVEY_DRAFT]: setSurveyDraft,
  [ROUTER_LOCATION_CHANGE]: handleLocationChange
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
