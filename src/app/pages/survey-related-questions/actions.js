const get = require('lodash/get')
const values = require('lodash/values')
const invert = require('lodash/invert')
const actions = require('@nudj/framework/actions')
const { merge, quickDispatch } = require('@nudj/library')

const SET_LIST_ORDER = 'SET_LIST_ORDER'

function setListOrder (order) {
  return quickDispatch({
    type: SET_LIST_ORDER,
    order
  })
}

function saveListOrder () {
  return (dispatch, getState) => {
    const state = getState()
    const questions = get(state, 'app.survey.questions', [])
    const defaultOrder = questions.map((question, index) => ({
      [question.id]: index + 1
    }))
    const userOrder = get(state, 'surveyRelatedQuestionsPage.order', {})
    const order = merge(...defaultOrder, userOrder)
    const indicies = values(order).sort()
    const keys = invert(order)

    if (values(keys).length !== questions.length) {
      const notification = { type: 'error', message: 'Two or more questions share an order value' }
      return dispatch(actions.app.showNotification(notification))
    }

    const data = { surveyQuestions: indicies.map(index => keys[index]) }
    const url = `/surveys/${state.app.survey.id}/questions`
    const method = 'patch'
    return dispatch(actions.app.postData({ data, url, method }))
  }
}

module.exports = {
  // actions
  saveListOrder,
  setListOrder,
  // constants
  SET_LIST_ORDER
}
