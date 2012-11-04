describe('Recorder', function() {
  var Recorder = require('../../lib/models/recorder');
  var sinon = require('sinon');
  var expect = require('expect.js');
  var _ = require('underscore');

  var Interceptors = require('../../lib/interceptors');
  var Listeners = require('../../lib/listeners');
  var EventBus = require('../../lib/models/event_bus');
  var RecordBuffer = require('../../lib/models/record_buffer');

  var fakeContext = { 
    document: { addEventListener: function() {} },
    sessionStorage: 'sessionStorage'
  };

  function doesContainInterceptor(sut, interceptorClass) {
    return _.find(sut.interceptors, function(klass) {
      return (klass == interceptorClass);
    }) == interceptorClass;
  }

  function doesContainListener(sut, listenerClass) {
    return _.find(sut.listeners, function(klass) {
      return (klass == listenerClass);
    }) == listenerClass;
  }

  describe('interceptors', function() {
    var sut;

    beforeEach(function() {
      sut = new Recorder(fakeContext);
    });

    it('has a click interceptor', function() {
      expect(doesContainInterceptor(sut, Interceptors.Click)).to.equal(true);
    });

    it('has a move interceptor', function() {
      expect(doesContainInterceptor(sut, Interceptors.Move)).to.equal(true);
    });
  });

  describe('listeners', function() {
    var sut;

    beforeEach(function() {
      sut = new Recorder(fakeContext);
    });

    it('has a click listener', function() {
      expect(doesContainListener(sut, Listeners.Click)).to.equal(true);
    });

    it('has a move listener', function() {
      expect(doesContainListener(sut, Listeners.Move)).to.equal(true);
    });
  });

  describe('.initialize', function() {
    var sut;

    beforeEach(function() {
      sut = new Recorder(fakeContext);
    });

    it('instances a new bus', function() {
      expect(sut.bus instanceof EventBus).to.equal(true);
    });

    it('passes a new record buffer to the event bus', function() {
      expect(sut.bus.buffer instanceof RecordBuffer).to.equal(true);
      expect(sut.bus.buffer.sessionStorage).to.equal(fakeContext.sessionStorage);
    });

    it('passes the interceptors to it', function() {
      expect(sut.bus.interceptors).to.equal(sut.interceptors);
    });

    it('instances all listeners passing the context and bus.eventListener function', function() {
      expect((sut.activeListeners[0] instanceof sut.listeners[0])).to.equal(true);
    });

    it('passes each listener the context and the bus.eventListener', function() {
      expect(sut.activeListeners[0].context).to.equal(fakeContext);
      expect(sut.activeListeners[0].eventListener).to.equal(sut.bus.eventListener);
    });
  });

  describe('.record', function() {
    var sut;

    beforeEach(function() {
      sut = new Recorder(fakeContext);
      sut.bus.record = sinon.spy();

      sut.record();
    });

    it('calls record on the bus', function() {
      expect(sut.bus.record.called).to.equal(true);
    });
  });

  describe('.stop', function() {
    var sut;
    var results;
    var json = 'json';

    beforeEach(function() {
      sut = new Recorder(fakeContext);
      sut.bus.stop = function() {
        return json;
      }

      results = sut.stop();
    });

    it('returns the results bus.stop', function() {
      expect(results).to.equal(json);
    });
  });

  describe('.dealloc', function() {
    var sut;

    beforeEach(function() {
      sut = new Recorder(fakeContext);

      _.each(sut.activeListeners, function(listener) {
        listener.dealloc = sinon.spy();
      });
    });

    it('calls dealloc on all the listeners', function() {
      sut.dealloc();

      expect(sut.activeListeners[0].dealloc.called).to.equal(true);
    });
  });
});
