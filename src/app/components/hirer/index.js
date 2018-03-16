const React = require('react')
const { Link } = require('react-router-dom')

const RowItem = require('../row-item')

const Hirer = ({ id, firstName, lastName, email }) => {
  const rowTitle = `${firstName} ${lastName} ${email}`

  return (
    <RowItem
      rowClass='rowSmall'
      title={rowTitle}
      details={[]}
      actions={[
        <Link
          to={`/people/${id}`}
        >
          See person
        </Link>
      ]}
    />
  )
}

module.exports = Hirer
