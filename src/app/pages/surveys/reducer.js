const { merge } = require('@nudj/library')

const {
  SET_SURVEY_DRAFT
} = require('./actions')

const setSurveyDraft = (state, action) => merge(state, { draft: action.draft })

const actions = {
  [SET_SURVEY_DRAFT]: setSurveyDraft
}

const initialState = {
  draft: {
    company: '',
    intro: '',
    outro: '',
    introDescription: '',
    outroDescription: ''
  }
}

const reducer = (initialState, actions) => (state = initialState, action) => {
  const { type } = action
  const subreducer = actions[type]
  return subreducer ? subreducer(state, action) : state
}

module.exports = reducer(initialState, actions)
