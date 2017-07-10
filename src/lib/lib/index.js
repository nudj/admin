const deepmerge = require('deepmerge')

// make merge non-destructive (emulates immutability)
const merge = (...objs) => deepmerge.all([{}, ...objs], { clone: true })

const stripDelims = (tag) => tag.slice(2, -2)

module.exports = {
  merge,
  stripDelims
}
