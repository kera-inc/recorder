var transformer = require('../transformers/click');
var _ = require('underscore');

var Click = function(buffer) {
  this.buffer = buffer;
}

_.extend(Click.prototype, {
  waitingFor: 'click',
  priority: 1,
  transformer: transformer,

  deliver: function(event) {
    this.buffer.write( this.transformer.transform( event ) );
  }
});

module.exports = Click;
