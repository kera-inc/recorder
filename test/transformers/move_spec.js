describe('Kera.Transformers.Move', function() {
  var Move = require('../../lib/transformers/move');
  var expect = require('expect.js');
  var $ = require('jquery');

  function createAndMove(html, selector, callback) {
    $('body').html(html);

    $(selector).mousemove(function(event) {
      callback(event);
    });

    $(selector).mousemove();
  }

  describe('.transform', function() {
    var domEvent;

    describe('when targetting an element with an id', function() {
      beforeEach(function(done) {
        createAndMove('<div id="myItem"></div>', '#myItem', function(event) {
          domEvent = event;
          done();
        });
      });

      it('returns an event of type move', function() {
        expect(Move.transform(domEvent).type).to.equal('move');
      });

      it('returns an event with the full css path', function() {
        expect(Move.transform(domEvent).path).to.equal('#myItem');
      });
    });
  });
});
