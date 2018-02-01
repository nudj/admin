const { actionMapAssign } = require('@nudj/library')

const people = require('../../server/modules/people')
const { getAll: getAllHirers } = require('../../server/modules/hirers')

function get ({ data }) {
  return actionMapAssign(
    data,
    {
      people: () => getAllHirers({}).then(({ hirers }) => {
        const allHirers = hirers.map(hirer => {
          return people.get({}, hirer.person)
            .then(result => result.person)
        })

        return Promise.all(allHirers)
      })
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
