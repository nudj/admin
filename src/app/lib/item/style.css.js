let {
  css,
  mixins
} = require('@nudj/framework/css')

const list = {
  listStyle: 'none',
  padding: 0,
  margin: 0
}
const button = {
  ...mixins.button,
  display: 'inline-block'
}

module.exports = css({
  ...mixins.formStructure,
  ...mixins.formElements,
  list,
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
  relations: {
    ...list,
    marginBottom: '1rem'
  },
  relationLink: {
    ...button,
    marginRight: '1rem'
  }
})
