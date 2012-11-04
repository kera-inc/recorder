var _ = require('underscore');

var Interceptors = require('../interceptors');
var Listeners = require('../listeners');
var EventBus = require('./event_bus');
var RecordBuffer = require('./record_buffer');

var Recorder = function(context) {
  this.interceptors = [Interceptors.Click, Interceptors.Move];
  this.listeners = [Listeners.Click, Listeners.Move];

  this.activeListeners = [];

  this.context = context;

  this.bus = new EventBus(this.interceptors, new RecordBuffer(context.sessionStorage));
  this.activeListeners = _.collect(this.listeners, _.bind(this._collectListeners, this));
}

_.extend(Recorder.prototype, {
  _collectListeners: function(listenerClass) {
    return new listenerClass(this.context, this.bus.eventListener);
  },

  record: function() {
    this.bus.record();
  },

  stop: function() {
    return this.bus.stop();
  },

  dealloc: function() {
    _.invoke(this.activeListeners, 'dealloc');
  }
});

module.exports = Recorder;
