var detectSelector = require('detect_selector');

var Click = {
  transform: function(domEvent) {
    return { type: 'click', path: detectSelector(domEvent.target) };
  }
}

module.exports = Click;
