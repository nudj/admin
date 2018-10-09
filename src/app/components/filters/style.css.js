let {
  css,
  mixins
} = require('@nudj/framework/css')

const button = {
  ...mixins.button,
  display: 'inline-block'
}

module.exports = css({
  button,
  filters: {
    padding: 0,
    marginTop: 0,
    display: 'inline-block'
  },
  filter: {
    listStyle: 'none',
    marginLeft: '1rem'
  },
  filterButton: mixins.buttonSecondary
})
