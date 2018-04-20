const { values: expertiseTags } = require('@nudj/api/gql/schema/enums/expertise-tags')
const { values: hirerTypes } = require('@nudj/api/gql/schema/enums/hirer-types')

const questionTypes = {
  COMPANIES: 'COMPANIES',
  CONNECTIONS: 'CONNECTIONS'
}

module.exports = {
  questionTypes,
  expertiseTags,
  hirerTypes
}
