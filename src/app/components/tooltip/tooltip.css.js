let {
  css,
  merge,
  mixins,
  variables
} = require('../../../framework/lib/css')

module.exports = css({
  tooltip: merge(mixins.cardStyle, {
    borderRadius: `${variables.sizing.baseBorderRadius} 0 0 ${variables.sizing.baseBorderRadius}`,
    zIndex: variables.zIndicies.tooltip,
    [mixins.breakpoints.l]: {
      borderRadius: variables.sizing.baseBorderRadius
    }
  }),
  tooltipTitle: merge(mixins.typography.h5),
  tooltipText: merge(mixins.typography.p),
  tooltipIntercomButton: merge(mixins.button)
})
