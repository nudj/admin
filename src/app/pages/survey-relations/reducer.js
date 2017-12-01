// @flow
const { merge } = require('@nudj/library')

type InitialState = {
  order: Object
}

const {
  SET_LIST_ORDER,
  RESET_ORDER
} = require('./actions')

const initialState = {
  order: {}
}

const setListOrder = (state: Object, action: Object) => (
  merge(state, { order: action.order })
)

const resetOrder = (state, action) => initialState

const actions = {
  [SET_LIST_ORDER]: setListOrder,
  [RESET_ORDER]: resetOrder
}

const reducer = (initialState: InitialState, actions: Object) => (state: Object = initialState, action: Object) => {
  const { type } = action
  const subreducer = actions[type]
  return subreducer ? subreducer(state, action) : state
}

module.exports = reducer(initialState, actions)
