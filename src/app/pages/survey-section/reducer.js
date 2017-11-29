const { merge } = require('@nudj/library')

const {
  SET_SURVEY_SECTION_DRAFT
} = require('./actions')

const setSurveySectionDraft = (state, action) => (
  merge(state, { draft: action.draft })
)

const actions = {
  [SET_SURVEY_SECTION_DRAFT]: setSurveySectionDraft
}

const initialState = {
  draft: {}
}

const reducer = (initialState, actions) => (state = initialState, action) => {
  const { type } = action
  const subreducer = actions[type]
  return subreducer ? subreducer(state, action) : state
}

module.exports = reducer(initialState, actions)
