const find = require('lodash/find')
const actions = require('@nudj/framework/actions')
const { merge } = require('@nudj/library')

const quickDispatch = (action) => (dispatch, getState) => dispatch(action)

const SET_SURVEY_DRAFT = 'SET_SURVEY_DRAFT'
module.exports.SET_SURVEY_DRAFT = SET_SURVEY_DRAFT

type Company = {
  id: string,
  name?: string
}

type Draft = {
  id?: string | number,
  introTitle?: string,
  outroTitle?: string,
  introDescription?: string,
  outroDescription?: string,
  slug?: string,
  company?: Company,
}

type SubmitData = {
  company?: string,
  comapnies?: Array<string>,
  draft: Draft,
  slugs: Array<string>,
  existingSurvey: Draft
}

function setSurveyDraft (draft: Draft) {
  return {
    type: SET_SURVEY_DRAFT,
    draft
  }
}
module.exports.setSurveyDraft = (draft) => quickDispatch(setSurveyDraft(draft))

function submitSurvey ({ company, companies, draft, slugs, existingSurvey }: SubmitData) {
  return (dispatch, getState) => {
    const data = company.id ? merge(draft, { company: company.id }) : draft
    const validCompany = !!find(companies, { id: data.company })

    if (!validCompany && !existingSurvey.id) {
      const notification = { type: 'error', message: 'Please choose a company' }
      return dispatch(actions.app.showNotification(notification))
    }

    if (slugs.includes(data.slug)) {
      const notification = { type: 'error', message: 'Invalid slug' }
      return dispatch(actions.app.showNotification(notification))
    }

    let method = 'post'
    let url = '/survey/new'

    if (existingSurvey.id) {
      method = 'patch'
      url = `/survey/${existingSurvey.id}`
    }
    return dispatch(actions.app.postData({ data, url, method }))
  }
}
module.exports.submitSurvey = submitSurvey
