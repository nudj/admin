const { merge } = require('@nudj/library')

const {
  UPDATE_SURVEY
} = require('./actions')

const updateSurvey = (state, action) => {
  return merge(state, {})
}

const actions = {
  [UPDATE_SURVEY]: updateSurvey
}

const initialState = {}

const reducer = (initialState, actions) => (state = initialState, action) => {
  const { type } = action
  const subreducer = actions[type]
  return subreducer ? subreducer(state, action) : state
}

module.exports = reducer(initialState, actions)
