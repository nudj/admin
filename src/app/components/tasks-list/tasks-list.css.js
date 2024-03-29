const { css, merge } = require('@nudj/framework/css')
const { mixins } = require('../../lib/css')

module.exports = css({
  copy: merge(mixins.typography.p, {}),
  tasks: {
    display: 'flex',
    flexWrap: 'wrap',
    listStyle: 'none',
    margin: 0,
    padding: 0
  }
})
