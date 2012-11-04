describe('Kera.Interceptors.Move', function() {
  var MoveTransformer = require('../../lib/transformers/move');
  var Move = require('../../lib/interceptors/move');
  var sinon = require('sinon');
  var expect = require('expect.js');

  var fakeBuffer = {};
  var sut;

  beforeEach(function() {
    sut = new Move(fakeBuffer);
  });

  describe('constructor', function() {
    it('stores the buffer for later', function() {
      expect(sut.buffer).to.equal(fakeBuffer);
    });

    it('assigns Kera.Transformers.Move to the transformer', function() {
      expect(sut.transformer).to.equal(MoveTransformer);
    });
  });

  describe('.waitingFor', function() {
    it('always waits for mousemove', function() {
      expect(sut.waitingFor).to.equal('mousemove');
    });
  });

  describe('.priority', function() {
    it('always has a priority of 1', function() {
      expect(sut.priority).to.equal(1);
    });
  });

  describe('.deliver', function() {
    var keraEvent = { id: 'kera_event' }, domEvent = { id: 'dom_event' };

    var clock;

    beforeEach(function() {
      clock = sinon.useFakeTimers();

      sut.transformer = {};
      sut.transformer.transform = sinon.stub();
      sut.transformer.transform.withArgs(domEvent).returns(keraEvent);
      fakeBuffer.write = sinon.spy();
    });

    afterEach(function() {
      clock.restore();
    });

    describe('when 3 events come in within 250 ms', function() {
      beforeEach(function() {
        sut.deliver(domEvent);
        clock.tick(50);
        sut.deliver(domEvent);
        clock.tick(50);
        sut.deliver(domEvent);

        clock.tick(9000);
      });

      it('translates into a single kera event', function() {
        expect(fakeBuffer.write.withArgs(keraEvent).calledOnce).to.equal(true);
      });
    });

    describe('when 2 events come in seperated by 250 ms', function() {
      beforeEach(function() {
        sut.deliver(domEvent);
        clock.tick(250);
        sut.deliver(domEvent);

        clock.tick(9000);
      });

      it('translates into two kera events', function() {
        expect(fakeBuffer.write.withArgs(keraEvent).calledTwice).to.equal(true);
      });
    });
  });
});
