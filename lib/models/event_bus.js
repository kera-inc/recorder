var RecordBuffer = require('./record_buffer');
var _ = require('underscore');
var $ = require('jquery');

var EventBus = function(interceptors, buffer) {
  this.buffer = buffer;
  this.interceptors = interceptors;
  this.activeInterceptors = _.collect(this.interceptors, _.bind(this._collectInterceptors, this));

  this.eventListener = _.bind(this._eventListener, this);
}

_.extend(EventBus.prototype, {
  _collectInterceptors: function(interceptorClass) {
    return new interceptorClass(this.buffer);
  },

  _eventListener: function(event) {
    if (!this.recording)
      return;

    var listeningInterceptors = _.filter(this.activeInterceptors, _.bind(this._waitingForEvent, this, event.type));
    var target = _.max(listeningInterceptors.reverse(), this._highestPriority);

    target.deliver(event);
  },

  _highestPriority: function(interceptor) {
    return interceptor.priority;
  },

  _waitingForEvent: function(type, interceptor) {
    return (interceptor.waitingFor == type);
  },

  record: function() {
    this.recording = true;

    this.buffer.open();
  },

  stop: function() {
    this.recording = false;

    return this.buffer.close();
  }
});

module.exports = EventBus;
