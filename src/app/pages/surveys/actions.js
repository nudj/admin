const quickDispatch = (action) => (dispatch, getState) => dispatch(action)

const SET_SURVEY_DRAFT = 'SET_SURVEY_DRAFT'
module.exports.SET_SURVEY_DRAFT = SET_SURVEY_DRAFT

function setSurveyDraft (draft) {
  return {
    type: SET_SURVEY_DRAFT,
    draft
  }
}
module.exports.setSurveyDraft = (draft) => quickDispatch(setSurveyDraft(draft))
