const { merge } = require('@nudj/library')

const {
  SET_LIST_ORDER
} = require('./actions')

const setListOrder = (state, action) => (
  merge(state, { order: action.order })
)

const actions = {
  [SET_LIST_ORDER]: setListOrder
}

const initialState = {
  order: {}
}

const reducer = (initialState, actions) => (state = initialState, action) => {
  const { type } = action
  const subreducer = actions[type]
  return subreducer ? subreducer(state, action) : state
}

module.exports = reducer(initialState, actions)
