/* global Draft */
// @flow
const { merge } = require('@nudj/library')

type State = {
  draft: Draft
}

const {
  SET_SURVEY_DRAFT
} = require('./actions')

const setSurveyDraft = (state: Object, action: Object) => merge(state, { draft: action.draft })

const actions = {
  [SET_SURVEY_DRAFT]: setSurveyDraft
}

const initialState = {
  draft: {}
}

const reducer = (initialState: State, actions: Object) => (state: Object = initialState, action: Object) => {
  const { type } = action
  const subreducer = actions[type]
  return subreducer ? subreducer(state, action) : state
}

module.exports = reducer(initialState, actions)
