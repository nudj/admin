const { values: expertiseTags } = require('@nudj/api/gql/schema/enums/expertise-tags')
const { values: hirerTypes } = require('@nudj/api/gql/schema/enums/hirer-types')

const questionTypes = {
  COMPANIES: 'COMPANIES',
  CONNECTIONS: 'CONNECTIONS'
}

const DEFAULT_SURVEY_SLUG = 'default'

module.exports = {
  questionTypes,
  expertiseTags,
  hirerTypes,
  DEFAULT_SURVEY_SLUG
}
