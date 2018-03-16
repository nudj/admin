const React = require('react')

const Hirer = require('../hirer')

const ListHirers = ({ hirers }) => {
  return (
    <ul>
      {hirers.map(hirer => (
        <Hirer
          key={hirer.id}
          id={hirer.person.id}
          firstName={hirer.person.firstName}
          lastName={hirer.person.lastName}
          email={hirer.person.email}
        />
      ))}
    </ul>
  )
}

ListHirers.defaultProps = {
  hirers: []
}

module.exports = ListHirers
