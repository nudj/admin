// @flow
const { merge } = require('@nudj/library')

type InitialState = {
  order: Object
}

const { SET_LIST_ORDER } = require('./actions')

const setListOrder = (state, action) => merge(state, { order: action.order })

const actions = {
  [SET_LIST_ORDER]: setListOrder
}

const initialState = {
  order: {}
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
