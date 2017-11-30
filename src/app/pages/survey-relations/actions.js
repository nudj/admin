const get = require('lodash/get')
const values = require('lodash/values')
const invert = require('lodash/invert')
const actions = require('@nudj/framework/actions')
const { merge } = require('@nudj/library')

const quickDispatch = (action) => (dispatch, getState) => dispatch(action)

const SET_LIST_ORDER = 'SET_LIST_ORDER'
module.exports.SET_LIST_ORDER = SET_LIST_ORDER

function setListOrder (order) {
  return {
    type: SET_LIST_ORDER,
    order
  }
}
module.exports.setListOrder = (order) => (
  quickDispatch(setListOrder(order))
)

function saveListOrder () {
  return (dispatch, getState) => {
    const state = getState()
    const sections = get(state, 'app.survey.sections', [])
    const defaultOrder = sections.map((section, index) => ({ [section.id]: index }))
    const userOrder = get(state, 'surveyRelationsPage.order', {})
    const order = merge(merge(...defaultOrder), userOrder)
    const indicies = values(order).sort()
    const keys = invert(order)

    const data = { surveySections: indicies.map(index => keys[index]) }
    const url = `/survey/${state.app.survey.id}/sections`
    const method = 'patch'
    return dispatch(actions.app.postData({ data, url, method }))
  }
}
module.exports.saveListOrder = saveListOrder
