/* global State DraftAction */
// @flow
const { merge } = require('@nudj/library')
const { SET_SURVEY_SECTION_DRAFT } = require('./actions')

type Actions = {
  [key: typeof SET_SURVEY_SECTION_DRAFT]: (
    state: State,
    action: DraftAction
  ) => Object
}

const setSurveySectionDraft = (state: Object, action: DraftAction) =>
  merge(state, { draft: action.draft })

const actions = {
  [SET_SURVEY_SECTION_DRAFT]: setSurveySectionDraft
}

const initialState = {
  draft: {}
}

const reducer = (initialState: State, actions: Actions) => (
  state: Object = initialState,
  action: Object
) => {
  const { type } = action
  const subreducer = actions[type]
  return subreducer ? subreducer(state, action) : state
}

module.exports = reducer(initialState, actions)
