var transformer = require('../transformers/move');
var _ = require('underscore');

var WAIT_BEFORE_SAVING = 250;

var Move = function(buffer) {
  this.buffer = buffer;

  this.deliver = _.debounce(_.bind(this._deliver, this), WAIT_BEFORE_SAVING);
}

_.extend(Move.prototype, {
  waitingFor: 'mousemove',
  priority: 1,
  transformer: transformer,

  _deliver: function(event) {
    this.buffer.write( this.transformer.transform( event ) );
  }
});

module.exports = Move;

