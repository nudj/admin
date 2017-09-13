const { actionMapAssign } = require('@nudj/library')

const people = require('../../server/modules/people')

function get ({ data }) {
  return actionMapAssign(
    data,
    {
      people: () => people.getAll({}).then(data => data.people)
    }
  )
}

function post ({
  data,
  body
}) {
  return actionMapAssign(
    data,
    {
      newPerson: () => people.post({}, body).then(data => data.newPerson)
    },
    {
      notification: data => ({
        message: `${data.newPerson.firstName} ${data.newPerson.lastName} added`,
        type: 'success'
      }),
      people: () => people.getAll({}).then(data => data.people)
    }
  )
}

module.exports = {
  get,
  post
}
