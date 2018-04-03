const { values: expertiseTags } = require('@nudj/api/gql/schema/enums/expertise-tags')

const questionTypes = {
  COMPANIES: 'COMPANIES',
  CONNECTIONS: 'CONNECTIONS'
}

module.exports = {
  questionTypes,
  expertiseTags
}
