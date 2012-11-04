var detectSelector = require('detect_selector');

var Move = {
  transform: function(domEvent) {
    return { type: 'move', path: detectSelector(domEvent.target) };
  }
}

module.exports = Move;
