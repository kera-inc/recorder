describe('Kera.Interceptors.Click', function() {
  var ClickTransformer = require('../../lib/transformers/click');
  var Click = require('../../lib/interceptors/click');
  var sinon = require('sinon');
  var expect = require('expect.js');

  var fakeBuffer = {};
  var sut;

  beforeEach(function() {
    sut = new Click(fakeBuffer);
  });

  describe('constructor', function() {
    it('stores the buffer for later', function() {
      expect(sut.buffer).to.equal(fakeBuffer);
    });

    it('assigns Kera.Transformers.Click to the transformer', function() {
      expect(sut.transformer).to.equal(ClickTransformer);
    });
  });

  describe('.waitingFor', function() {
    it('always waits for click', function() {
      expect(sut.waitingFor).to.equal('click');
    });
  });

  describe('.priority', function() {
    it('always has a priority of 1', function() {
      expect(sut.priority).to.equal(1);
    });
  });

  describe('.deliver', function() {
    var keraEvent = { id: 'kera_event' }, domEvent = { id: 'dom_event' };

    beforeEach(function() {
      sut.transformer = {};
      sut.transformer.transform = sinon.stub();
      sut.transformer.transform.withArgs(domEvent).returns(keraEvent);

      fakeBuffer.write = sinon.spy();
      sut.deliver(domEvent);
    });

    it('writes the kera_event returned from the transformer to the buffer', function() {
      expect(fakeBuffer.write.calledWith(keraEvent)).to.equal(true);
    });
  });
});
