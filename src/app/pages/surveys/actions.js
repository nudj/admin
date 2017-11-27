const quickDispatch = (action) => (dispatch, getState) => dispatch(action)

const UPDATE_SURVEY = 'UPDATE_SURVEY'
module.exports.UPDATE_SURVEY = UPDATE_SURVEY
function updateSurvey () {
  return {
    type: UPDATE_SURVEY
  }
}
module.exports.updateSurvey = () => quickDispatch(updateSurvey())
