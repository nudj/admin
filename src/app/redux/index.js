const React = require('react')
const { Helmet } = require('react-helmet')
const isEqual = require('lodash/isEqual')
const cookies = require('js-cookie')

const analytics = require('../lib/browser-analytics')

class ReduxRoot extends React.Component {
  componentDidMount () {
    if (!cookies.get('mixpanelDistinctId')) {
      cookies.set('mixpanelDistinctId', analytics.getId(), {
        domain: 'nudj.co',
        expires: 3650 // 10 years
      })
    }

    if (this.props.userId) {
      analytics.identify({ id: this.props.userId })
    }

    analytics.track({
      object: analytics.objects.page,
      action: analytics.actions.page.viewed,
      properties: {
        pathname: this.props.location.pathname,
        search: this.props.location.search,
        hash: this.props.location.hash
      }
    })
  }

  componentDidUpdate (prevProps) {
    if (!isEqual(prevProps.location, this.props.location)) {
      analytics.track({
        object: analytics.objects.page,
        action: analytics.actions.page.viewed,
        properties: {
          pathname: this.props.location.pathname,
          search: this.props.location.search,
          hash: this.props.location.hash
        }
      })
    }
  }

  render () {
    return (
      <div className={this.props.className}>
        <Helmet>
          <meta charSet='utf-8' />
          <title>ADMIN</title>
          <meta name='viewport' content='width=device-width, initial-scale=1' />
        </Helmet>
        {this.props.children}
      </div>
    )
  }
}

module.exports = ReduxRoot
