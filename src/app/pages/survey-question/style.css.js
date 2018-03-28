let {
  merge,
  mixins,
  variables
} = require('@nudj/framework/css')

const { StyleSheet } = require('@nudj/components/lib/css')

const styles = merge(mixins.pageLayout, mixins.formStructure, mixins.formElements, {
  link: merge({
    margin: `0 0 0 ${variables.padding.d}`
  }, mixins.button),
  field: {
    marginBottom: '1em'
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    maxWidth: '42rem',
    ':nth-child(n) > *': {
      flexBasis: '50%'
    }
  }
})

module.exports = StyleSheet.create(styles)
