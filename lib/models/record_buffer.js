var guid = require('guid');
var _ = require('underscore');

var RECORD_KEY = 'Kera.Recording.recordingId';

var RecordBuffer = function(sessionStorage) {
  this.sessionStorage = sessionStorage;
};

_.extend(RecordBuffer.prototype, {
  open: function() {
    this.startTime = new Date().getTime();

    if (this._isLoaded()) {
      this._loadStorage();
    } else {
      this._setupFromScratch();
      this._saveStorage();
    }
  },

  _isLoaded: function() {
    return this.sessionStorage.getItem(RECORD_KEY);
  },

  _loadStorage: function() {
    this.recordingId = this.sessionStorage.getItem(RECORD_KEY);
    this.offsetTime = this.startTime - parseInt(this.sessionStorage.getItem( this._getStartTimeKey() ));
  },

  _setupFromScratch: function() {
    this.recordingId = guid();
    this.offsetTime = 0;
    this._resetIndex();
  },

  _saveStorage: function() {
    this.sessionStorage.setItem(RECORD_KEY, this.recordingId);
    this.sessionStorage.setItem(this._getStartTimeKey(), this.startTime);
  },

  _getStartTimeKey: function() {
    return 'Kera.Recording-' + this.recordingId + '-startTime';
  },

  _resetIndex: function() {
    this.sessionStorage.setItem( this._getIndexKey(), '0' );
  },

  currentIndex: function() {
    return parseInt(this.sessionStorage.getItem( this._getIndexKey() ));
  },

  _getIndexKey: function() {
    return 'Kera.Recording-' + this.recordingId + '-index';
  },

  getItemAt: function(index) {
    var json = this.sessionStorage.getItem( this._getItemKey(index) );
    return JSON.parse(json);
  },

  _getItemKey: function(index) {
    return 'Kera.Recording-' + this.recordingId + '-' + index;
  },

  write: function(event) {
    event.time = this._getTimeStamp();

    this.setItemAt(this.currentIndex(), event);
    this._incrementIndex();
  },

  _getTimeStamp: function() {
    var timeStamp = new Date().getTime();
    var diff = timeStamp - this.startTime;

    return diff + this.offsetTime;
  },

  setItemAt: function(index, event) {
    this.sessionStorage.setItem(this._getItemKey(index), JSON.stringify(event));
  },

  _incrementIndex: function() {
    this.sessionStorage.setItem( this._getIndexKey(), this.currentIndex() + 1 );
  },

  close: function() {
    var events = this._getAllEvents();
    this._cleanupSession();

    return events;
  },

  _getAllEvents: function() {
    var events = [];

    for (var i=0; i < this.currentIndex(); i++) {
      events.push( this.getItemAt(i) );
    }

    return events;
  },

  _cleanupSession: function() {
    this.sessionStorage.removeItem(RECORD_KEY);
    this.sessionStorage.removeItem(this._getStartTimeKey());

    for (var i = 0; i < this.currentIndex(); i++) {
      this.sessionStorage.removeItem( this._getItemKey(i) );
    }

    this.sessionStorage.removeItem(this._getIndexKey());
  }
});

module.exports = RecordBuffer;
