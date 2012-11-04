//= require recording/models/record_buffer

describe('RecordBuffer', function() {
  var RecordBuffer = require('../../lib/models/record_buffer');
  var sinon = require('sinon');
  var expect = require('expect.js');

  var sessionStorage = {
    data: {},

    clear: function() {
      this.data = {};
    },

    getItem: function(key) {
      var key = this.data[key];

      if (key)
        return key.toString();
      else
        return null;
    },

    setItem: function(key, value) {
      this.data[key] = value;
    },

    removeItem: function(key) {
      delete this.data[key];
    }
  };

  afterEach(function() {
    sessionStorage.clear();
  });

  describe('#open', function() {
    it('sets the start time', function() {
      var sut = new RecordBuffer(sessionStorage);

      expect(sut.startTime).to.equal(undefined);

      sut.open();

      expect(sut.startTime).to.not.equal(undefined);
    });

    it('sets Kera.Recording-#{id}-startTime to the start time', function() {
      var sut = new RecordBuffer(sessionStorage);
      sut.open();

      expect(parseInt(sessionStorage.getItem(sut._getStartTimeKey()))).to.equal(sut.startTime);
    });

    describe('when a recordingId is already set in sessionStorage', function() {
      var sut, recordingId = '123';
      var startTime;

      beforeEach(function() {
        startTime = new Date().getTime() - 1000;

        sessionStorage.setItem('Kera.Recording.recordingId', recordingId);
        sessionStorage.setItem('Kera.Recording-123-startTime', startTime);

        sut = new RecordBuffer(sessionStorage);
        sut.open();
      });

      it('uses the recordingId from session storage', function() {
        expect(sut.recordingId).to.equal(recordingId);
      });

      it('calculates the difference between the start time and the original start: the start offset time', function() {
        expect(sut.offsetTime).to.equal(1000);
      });
    });

    describe('when the recordingId is not set in sessionStorage', function() {
      var sut;

      beforeEach(function() {
        sut = new RecordBuffer(sessionStorage);
        sut.open();
      });

      it('generates a new recordingId', function() {
        expect(sut.recordingId).to.not.equal(undefined);
      });

      it('saves the recordingId to sessionStorage', function() {
        expect(sessionStorage.getItem('Kera.Recording.recordingId')).to.equal(sut.recordingId);
      });

      it('sets the index to 0', function() {
        expect(sut.currentIndex()).to.equal(0);
      });

      it('sets the offsetTime to 0', function() {
        expect(sut.offsetTime).to.equal(0);
      });
    });
  });

  describe('#currentIndex', function() {
    var sut;

    beforeEach(function() {
      sut = new RecordBuffer(sessionStorage);
      sessionStorage.setItem(sut._getIndexKey(), '4');
    });

    it('gets the index out of session storage', function() {
      expect(sut.currentIndex()).to.equal(4);
    });
  });

  describe('#getItemAt', function() {
    it('returns an object version of an event stored in sessionStorage', function() {
      var sut = new RecordBuffer(sessionStorage);
      sut.open();

      sessionStorage.setItem(sut._getItemKey(0), '{ "key": "value" }');

      expect(sut.getItemAt(0).key).to.equal('value');
    });
  });

  describe('#write', function() {
    var sut;
    var clock;
    var fakeEvent = { id: 'fakeEvent' };

    beforeEach(function() {
      clock = sinon.useFakeTimers();

      sut = new RecordBuffer(sessionStorage);
      sut.open();
      sut.offsetTime = 1000;
    });

    afterEach(function() {
      clock.restore();
    });

    it('adds a time property to the event based on the difference from the start time plus start offset time', function() {
      clock.tick(1000);

      sut.write(fakeEvent);

      expect(sut.getItemAt(0).time).to.equal(2000);
    });

    it('increments the index', function() {
      sut.write(fakeEvent);

      expect(sut.currentIndex()).to.equal(1);
    });
  });

  describe('#close', function() {
    var sut, clock, fakeEvent = { id: 'fakeEvent' };
    var events;

    beforeEach(function() {
      clock = sinon.useFakeTimers();
      sut = new RecordBuffer(sessionStorage);
      sut.open();

      sut.write(fakeEvent);

      clock.tick(1000);
      sut.write(fakeEvent);

      clock.tick(1000);
      sut.write(fakeEvent);

      events = sut.close();
    });

    afterEach(function() {
      clock.restore();
    });

    it('returns the events', function() {
      expect(events[0].time).to.equal(0);
      expect(events[1].time).to.equal(1000);
      expect(events[2].time).to.equal(2000);
    });

    it('deletes Kera.Recording.recordingId', function() {
      expect(sessionStorage.getItem('Kera.Recording.recordingId')).to.equal(null);
    });

    it('deletes Kera.Recording-#{id}-startTime', function() {
      expect(sessionStorage.getItem( sut._getStartTimeKey() )).to.equal(null);
    });

    it('deletes Kera.Recording-#{id}-index', function() {
      expect(sessionStorage.getItem( sut._getIndexKey() )).to.equal(null);
    });

    it('deletes all Kera.Recording-#{id}-{index}', function() {
      expect(sessionStorage.getItem( sut._getItemKey(0) )).to.equal(null);
      expect(sessionStorage.getItem( sut._getItemKey(1) )).to.equal(null);
      expect(sessionStorage.getItem( sut._getItemKey(2) )).to.equal(null);
    });
  });
});
