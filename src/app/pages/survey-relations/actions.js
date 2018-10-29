const get = require('lodash/get')
const values = require('lodash/values')
const invert = require('lodash/invert')
const actions = require('@nudj/framework/actions')
const { merge, quickDispatch } = require('@nudj/library')

const SET_LIST_ORDER = 'SET_LIST_ORDER'
const RESET_ORDER = 'RESET_ORDER'

function setListOrder (order) {
  return quickDispatch({
    type: SET_LIST_ORDER,
    order
  })
}

function resetOrder () {
  return quickDispatch({
    type: RESET_ORDER
  })
}

function saveListOrder () {
  return (dispatch, getState) => {
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
      const notification = {
        type: 'error',
        message: 'One or more sections have the same order'
      }
      return dispatch(actions.app.showNotification(notification))
    }

    const data = { surveySections: indicies.map(index => keys[index]) }
    const url = `/surveys/${state.app.survey.id}/sections`
    const method = 'patch'
    return dispatch(
      actions.app.postData({ data, url, method }, () => {
        dispatch(resetOrder())
      })
    )
  }
}
module.exports.saveListOrder = saveListOrder

module.exports = {
  // actions
  setListOrder,
  resetOrder,
  saveListOrder,
  // constants
  RESET_ORDER,
  SET_LIST_ORDER
}
