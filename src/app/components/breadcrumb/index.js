const React = require('react')

const { Text } = require('@nudj/components')

const Breadcrumb = props => {
  if (!props.children) return null

  return (
    <Text element='div'>
      {[].concat(props.children).map((child, index) => (
        props.children.length - 1 === index ? (
          <span key={index}>{child}</span>
        ) : (
          <span key={index}>{child}{' >> '}</span>
        )
      ))}
    </Text>
  )
}

module.exports = Breadcrumb
