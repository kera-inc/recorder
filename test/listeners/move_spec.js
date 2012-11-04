describe('Kera.Listeners.Move', function() {
  var Move = require('../../lib/listeners/move');
  var sinon = require('sinon');
  var expect = require('expect.js');

  var fakeContext, fakeDocument, fakeEventListener, sut;

  beforeEach(function() {
    fakeEventListener = sinon.spy();

    fakeDocument = {};
    fakeDocument.addEventListener = sinon.spy();
    fakeDocument.removeEventListener = sinon.spy();

    fakeContext = { document: fakeDocument };
    sut = new Move(fakeContext, fakeEventListener);
  });

  describe('constructor', function() {
    it('adds an eventListener to the document', function() {
      expect(fakeDocument.addEventListener.calledWith('mousemove', fakeEventListener, true)).to.equal(true);
    });
  });

  describe('.dealloc', function() {
    beforeEach(function() {
      sut.dealloc();
    });

    it('calls removeEventListener on the document', function() {
      expect(fakeDocument.removeEventListener.calledWith('mousemove', fakeEventListener, true)).to.equal(true);
    });
  });
});
