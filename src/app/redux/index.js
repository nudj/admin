const React = require('react')
const { Helmet } = require('react-helmet')

const ReduxRoot = (props) => {
  return (
    <div className={`${props.className}`}>
      <Helmet>
        <meta charSet='utf-8' />
        <title>ADMIN</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Helmet>
      {props.children}
    </div>
  )
}

module.exports = ReduxRoot
