describe('Kera.Listeners.Click', function() {
  var Click = require('../../lib/listeners/click');
  var sinon = require('sinon');
  var expect = require('expect.js');

  var fakeContext, fakeDocument, fakeEventListener, sut;

  beforeEach(function() {
    fakeEventListener = sinon.spy();

    fakeDocument = {};
    fakeDocument.addEventListener = sinon.spy();
    fakeDocument.removeEventListener = sinon.spy();

    fakeContext = { document: fakeDocument };
    sut = new Click(fakeContext, fakeEventListener);
  });

  describe('constructor', function() {
    it('adds an eventListener to the document', function() {
      expect(fakeDocument.addEventListener.calledWith('click', fakeEventListener, true)).to.equal(true);
    });
  });

  describe('.dealloc', function() {
    beforeEach(function() {
      sut.dealloc();
    });

    it('calls removeEventListener on the document', function() {
      expect(fakeDocument.removeEventListener.calledWith('click', fakeEventListener, true)).to.equal(true);
    });
  });
});
