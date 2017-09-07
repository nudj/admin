const React = require('react')
const { withRouter } = require('react-router-dom')
const { connect } = require('react-redux')
const get = require('lodash/get')
const ScrollTop = require('../scroll-top/scroll-top')
const ErrorPage = require('../error-page/error-page')
const Status = require('../status/status')
const Loading = require('../loading/loading')

const withState = (callback) => {
  return withRouter(connect((state, props) => Object.assign({}, state, props))(callback))
}

const WithState = (Component) => {
  return withState((props) => {
    return <Component dispatch={props.dispatch} {...props.page} />
  })
}

const PageWithState = (Page) => {
  return withState((props) => {
    let page
    switch (true) {
      case !!get(props, 'page.error'):
        page = (
          <Status code={get(props, 'page.error.code')}>
            <ErrorPage {...props.page} />
          </Status>
        )
        break
      case !!get(props, 'page.loading'):
        page = <Loading />
        break
      default:
        page = <ScrollTop ignore={props.history.action === 'REPLACE'}><Page dispatch={props.dispatch} {...props.page} /></ScrollTop>
    }
    return page
  })
}

module.exports = {
  PageWithState,
  WithState
}
