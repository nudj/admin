const { merge } = require('@nudj/library')
const {
  SET_SURVEY_QUESTION_DRAFT,
  SET_SURVEY_QUESTION_TAGS
} = require('./actions')

const ROUTER_LOCATION_CHANGE = '@@router/LOCATION_CHANGE'

const setSurveyQuestionDraft = (state, action) =>
  merge(state, { draft: action.draft })

const setSurveyQuestionTags = (state, action) => ({
  ...state,
  tagsUpdated: true,
  tags: action.tags
})

const handleLocationChange = () => {
  return initialState
}

const actions = {
  [SET_SURVEY_QUESTION_DRAFT]: setSurveyQuestionDraft,
  [SET_SURVEY_QUESTION_TAGS]: setSurveyQuestionTags,
  [ROUTER_LOCATION_CHANGE]: handleLocationChange
}

const initialState = {
  draft: {},
  tagsUpdated: false,
  tags: []
}

const reducer = (initialState, actions) => (state = initialState, action) => {
  const { type } = action
  const subreducer = actions[type]
  return subreducer ? subreducer(state, action) : state
}

module.exports = reducer(initialState, actions)
