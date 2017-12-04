/* global Dispatch */
// @flow
const get = require('lodash/get')
const values = require('lodash/values')
const invert = require('lodash/invert')
const actions = require('@nudj/framework/actions')
const { merge, quickDispatch } = require('@nudj/library')

const SET_LIST_ORDER = 'SET_LIST_ORDER'
module.exports.SET_LIST_ORDER = SET_LIST_ORDER

function setListOrder (order: Object) {
  return {
    type: SET_LIST_ORDER,
    order
  }
}
module.exports.setListOrder = (order: Object) => quickDispatch(setListOrder(order))

const RESET_ORDER = 'RESET_ORDER'
module.exports.RESET_ORDER = RESET_ORDER

function resetOrder () {
  return {
    type: RESET_ORDER
  }
}
module.exports.resetOrder = () => quickDispatch(resetOrder())

function saveListOrder () {
  return (dispatch: Dispatch, getState: Function) => {
    const state = getState()
    const sections = get(state, 'app.survey.sections', [])
    const defaultOrder = sections.map((section, index) => ({
      [section.id]: index + 1
    }))
    const userOrder = get(state, 'surveyRelationsPage.order', {})
    const order = merge(...defaultOrder, userOrder)
    const indicies = values(order).sort()
    const keys = invert(order)

    if (values(keys).length !== sections.length) {
      const notification = { type: 'error', message: 'One or more sections have the same order' }
      return dispatch(actions.app.showNotification(notification))
    }

    const data = { surveySections: indicies.map(index => keys[index]) }
    const url = `/surveys/${state.app.survey.id}/sections`
    const method = 'patch'
    return dispatch(actions.app.postData({ data, url, method }, () => {
      dispatch(resetOrder())
    }))
  }
}
module.exports.saveListOrder = saveListOrder
