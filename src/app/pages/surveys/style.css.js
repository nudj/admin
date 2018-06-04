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
  addButton: merge(mixins.button, {
    display: 'inline-block'
  })
})

module.exports = StyleSheet.create(styles)
