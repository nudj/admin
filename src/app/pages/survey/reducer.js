// @flow
const { merge } = require('@nudj/library')

type Actions = {
  SET_SURVEY_DRAFT?: Function
}

type Company = {
  id: string | number,
  name?: string
}

type Draft = {
  introTitle?: string,
  outroTitle?: string,
  introDescription?: string,
  outroDescription?: string,
  slug?: string,
  company?: Company,
}

type State = {
  draft: Draft
}

const {
  SET_SURVEY_DRAFT
} = require('./actions')

const setSurveyDraft = (state, action) => merge(state, { draft: action.draft })

const actions = {
  [SET_SURVEY_DRAFT]: setSurveyDraft
}

const initialState = {
  draft: {}
}

const reducer = (initialState: State, actions: Actions) => (state: Object = initialState, action: Object) => {
  const { type } = action
  const subreducer = actions[type]
  return subreducer ? subreducer(state, action) : state
}

module.exports = reducer(initialState, actions)
