/* global Draft */
// @flow
const { merge } = require('@nudj/library')

type InitialState = {
  draft: Draft
}

const { SET_SURVEY_SECTION_DRAFT } = require('./actions')

const setSurveySectionDraft = (state: Object, action: Object) =>
  merge(state, { draft: action.draft })

const actions = {
  [SET_SURVEY_SECTION_DRAFT]: setSurveySectionDraft
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
