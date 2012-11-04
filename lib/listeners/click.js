var _ = require('underscore');
var TYPE = 'click';
var CAPTURE = true;

var Click = function(context, eventListener) {
  this.context = context;
  this.eventListener = eventListener;

  this.document = this.context.document;
  this._createListener();
}

_.extend(Click.prototype, {
  _createListener: function() {
    this.document.addEventListener(TYPE, this.eventListener, CAPTURE);
  },

  dealloc: function() {
    this.document.removeEventListener(TYPE, this.eventListener, CAPTURE);
  }
});

module.exports = Click;
