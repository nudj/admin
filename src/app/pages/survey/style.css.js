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
  childrenButton: merge(mixins.button, {
    margin: `${variables.padding.d} 0 0 0`,
    display: 'inline-block'
  }),
  field: {
    marginBottom: '1em'
  }
})

module.exports = StyleSheet.create(styles)
