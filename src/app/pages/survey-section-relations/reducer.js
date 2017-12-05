/* global State */
// @flow
const { merge } = require('@nudj/library')
const { SET_LIST_ORDER } = require('./actions')

type Action = {
  type: string,
  order?: Object
}

type ActionTypes = typeof SET_LIST_ORDER

type Actions = {
  [key: ActionTypes]: (state: State, action: Action) => State
}

const setListOrder = (state, action) => merge(state, { order: action.order })

const actions = {
  [SET_LIST_ORDER]: setListOrder
}

const initialState = {
  order: {}
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
