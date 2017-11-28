const quickDispatch = (action) => (dispatch, getState) => dispatch(action)

const SET_SURVEY_DRAFT = 'SET_SURVEY_DRAFT'
module.exports.SET_SURVEY_DRAFT = SET_SURVEY_DRAFT

type Company = {
  id: string,
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

function setSurveyDraft (draft: Draft) {
  return {
    type: SET_SURVEY_DRAFT,
    draft
  }
}
module.exports.setSurveyDraft = (draft) => quickDispatch(setSurveyDraft(draft))
