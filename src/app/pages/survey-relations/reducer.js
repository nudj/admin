/* global State */
// @flow
const { merge } = require('@nudj/library')
const { SET_LIST_ORDER, RESET_ORDER } = require('./actions')

type Action = {
  type: string,
  order?: Object
}

type ActionTypes = typeof SET_LIST_ORDER | typeof RESET_ORDER

type Actions = {
  [key: ActionTypes]: (state: State, action: Action) => State
}

const initialState = {
  order: {}
}

const setListOrder = (state: State, action: Action) =>
  merge(state, { order: action.order })

const resetOrder = (state, action) => initialState

const actions = {
  [SET_LIST_ORDER]: setListOrder,
  [RESET_ORDER]: resetOrder
}

const reducer = (initialState: State, actions: Actions) => (
  state: State = initialState,
  action: Action
) => {
  const { type } = action
  const subreducer = actions[type]
  return subreducer ? subreducer(state, action) : state
}

module.exports = reducer(initialState, actions)
