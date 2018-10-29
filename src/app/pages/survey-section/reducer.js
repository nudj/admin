const { merge } = require('@nudj/library')
const { SET_SURVEY_SECTION_DRAFT } = require('./actions')

const ROUTER_LOCATION_CHANGE = '@@router/LOCATION_CHANGE'

const setSurveySectionDraft = (state, action) =>
  merge(state, { draft: action.draft })

const handleLocationChange = () => {
  return initialState
}

const actions = {
  [SET_SURVEY_SECTION_DRAFT]: setSurveySectionDraft,
  [ROUTER_LOCATION_CHANGE]: handleLocationChange
}

const initialState = {
  draft: {}
}

const reducer = (initialState, actions) => (
  state = initialState,
  action
) => {
  const { type } = action
  const subreducer = actions[type]
  return subreducer ? subreducer(state, action) : state
}

module.exports = reducer(initialState, actions)
