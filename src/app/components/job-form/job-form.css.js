const { StyleSheet } = require('@nudj/components/lib/css')
const { mixins } = require('../../lib/css')

module.exports = StyleSheet.create({
  ...mixins.pageLayout,
  ...mixins.formStructure,
  ...mixins.formElements,
  formCard: mixins.cardStyle,
  inputBox: {
    ...mixins.formElements.inputBox,
    flexGrow: '1',
    width: '100%'
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
