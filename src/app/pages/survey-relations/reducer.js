const { merge } = require('@nudj/library')
const { SET_LIST_ORDER, RESET_ORDER } = require('./actions')

const initialState = {
  order: {}
}

const setListOrder = (state, action) => merge(state, { order: action.order })

const resetOrder = (state, action) => initialState

const actions = {
  [SET_LIST_ORDER]: setListOrder,
  [RESET_ORDER]: resetOrder
}

const reducer = (initialState, actions) => (state = initialState, action) => {
  const { type } = action
  const subreducer = actions[type]
  return subreducer ? subreducer(state, action) : state
}

module.exports = reducer(initialState, actions)
