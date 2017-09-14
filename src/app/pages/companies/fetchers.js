const { actionMapAssign } = require('@nudj/library')

const companies = require('../../server/modules/companies')

const pageData = {
  companies: () => companies.getAll()
}

const get = ({
  data,
  params
}) => actionMapAssign(
  data,
  pageData
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
    notification: data => ({
      message: `${data.newCompany.name} added`,
      type: 'success'
    })
  },
  pageData
)

module.exports = {
  get,
  post
}
