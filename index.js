void (function() {
  const Arche = type => (
    props = {}, children = [],
  ) => (typeof React !== 'undefined'
    ? React.createElement
    : () => {}
  )(type, props, ...children)
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = Arche
  } else {
    (this || self).Arche = Arche
  }
})()
