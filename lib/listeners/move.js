var _ = require('underscore');
var TYPE = 'mousemove';
var CAPTURE = true;

var Move = function(context, eventListener) {
  this.context = context;
  this.eventListener = eventListener;

  this.document = this.context.document;
  this._createListener();
}

_.extend(Move.prototype, {
  _createListener: function() {
    this.document.addEventListener(TYPE, this.eventListener, CAPTURE);

  },

  dealloc: function() {
    this.document.removeEventListener(TYPE, this.eventListener, CAPTURE);
  }
});

module.exports = Move;
