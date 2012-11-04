describe('Kera.Transformers.Click', function() {
  var Click = require('../../lib/transformers/click');
  var expect = require('expect.js');
  var $ = require('jquery');

  function createAndClick(html, selector, callback) {
    $('body').html(html);
    $(selector).click(function(event) {
      callback(event);
    });

    $(selector).click();
  }

  describe('.transform', function() {
    var domEvent;

    describe('when targetting an element with an id', function() {
      beforeEach(function(done) {
        createAndClick('<div id="myItem"></div>', '#myItem', function(event, $) {
          domEvent = event;
          done();
        });
      });

      it('returns an event type of click', function() {
        expect(Click.transform(domEvent).type).to.equal('click');
      });

      it('returns an event with the full css path', function() {
        expect(Click.transform(domEvent).path).to.equal('#myItem');
      });
    });

    describe('when targetting an element with a class', function() {
      beforeEach(function(done) {
        createAndClick(
          '<div class="meow"></div><div class="meow"></div><div class="bob"></div>', 
          '.meow', function(event, $) {
            domEvent = event;
            done();
          });
      });

      it('returns an event with the class selector', function() {
        expect(Click.transform(domEvent).path).to.equal('.meow:eq(0)');
      });
    });

    describe('when targetting an element without a class', function() {
      beforeEach(function(done) {
        createAndClick('<div id="root"><div></div><div></div></div>', '#root > div:eq(1)', function(event, $) {
          domEvent = event;

          done();
        });
      });

      it('returns the nth-child selector', function() {
        expect(Click.transform(domEvent).path).to.equal('#root>div:eq(1)');
      });
    });
  });
});
