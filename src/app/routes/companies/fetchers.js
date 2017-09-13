const { actionMapAssign } = require('@nudj/library')

const companies = require('../../server/modules/companies')

const get = ({
  data,
  params
}) => actionMapAssign(
  data,
  {
    companies: () => companies.getAll()
  }
)

const post = ({
  data,
  body
}) => actionMapAssign(
  data,
  {
    newCompany: () => companies.post(body)
  },
  {
    companies: () => companies.getAll(),
    notification: data => ({
      message: `${data.newCompany.name} added`,
      type: 'success'
    })
  }
)

module.exports = {
  get,
  post
}
