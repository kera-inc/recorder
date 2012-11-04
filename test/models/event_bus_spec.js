//= require recording/spec_helper
//= require recording/models/event_bus

describe('EventBus', function() {
  var EventBus = require('../../lib/models/event_bus');
  var sinon = require('sinon');
  var expect = require('expect.js');

  var FakeInterceptor = function(buffer) {
    this.buffer = buffer;
    this.priority = 1;
  };

  var FakeBuffer = function() {};
  FakeBuffer.prototype.close = function() { return 'promise' };
  FakeBuffer.prototype.open = function() {};

  describe('.constructor', function() {
    var sut;

    beforeEach(function() {
      sut = new EventBus([ FakeInterceptor ], new FakeBuffer());
    });

    it('iterates through the passed in interceptors creating and instance', function() {
      expect(sut.activeInterceptors[0] instanceof FakeInterceptor).to.equal(true);
    });

    it('passes in an instance of the buffer', function() {
      expect(sut.activeInterceptors[0].buffer instanceof FakeBuffer).to.equal(true);
    });
  });

  describe('.eventListener', function() {
    var sut;
    var clickEvent = { type: 'click' };
    var moveEvent = { type: 'move' };

    beforeEach(function() {
      sut = new EventBus([ FakeInterceptor, FakeInterceptor ], new FakeBuffer());
    });

    describe('when recording is true', function() {
      beforeEach(function() {
        sut.record();
      });


      describe('when the is one interceptor waiting for click and one waiting for move', function() {
        beforeEach(function() {
          sut.activeInterceptors[0].waitingFor = 'click';
          sut.activeInterceptors[0].deliver = sinon.spy();

          sut.activeInterceptors[1].waitingFor = 'move';
          sut.activeInterceptors[1].deliver = sinon.spy();
        });

        describe('the click interceptor', function() {
          var clickInterceptor;

          beforeEach(function() {
            clickInterceptor = sut.activeInterceptors[0];
          });

          it('does not receive the move event', function() {
            sut.eventListener(moveEvent);
            expect(clickInterceptor.deliver.called).to.equal(false);
          });

          it('receives the click event', function() {
            sut.eventListener(clickEvent);
            expect(clickInterceptor.deliver.calledWith(clickEvent)).to.equal(true);
          });

          describe('when there are two click interceptors', function() {
            var secondClickInterceptor;

            beforeEach(function() {
              secondClickInterceptor = new FakeInterceptor();
              secondClickInterceptor.waitingFor = 'click';
              secondClickInterceptor.deliver = sinon.spy();

              sut.activeInterceptors.push( secondClickInterceptor );
            });

            it('chooses the first one by default', function() {
              sut.eventListener(clickEvent);

              expect(clickInterceptor.deliver.calledWith(clickEvent)).equal(true);
            });

            it('chooses the second one if the priority is higher than the first', function() {
              clickInterceptor.priority = 1;
              secondClickInterceptor.priority = 2;

              sut.eventListener(clickEvent);

              expect(secondClickInterceptor.deliver.calledWith(clickEvent)).to.equal(true);
              expect(clickInterceptor.deliver.called).to.equal(false);
            });
          });
        });

        describe('the move interceptor', function() {
          var moveInterceptor;

          beforeEach(function() {
            moveInterceptor = sut.activeInterceptors[1];
          });

          it('does not receive the click event', function() {
            sut.eventListener(clickEvent);
            expect(moveInterceptor.deliver.called).to.equal(false);
          });

          it('receives the move event', function() {
            sut.eventListener(moveEvent);
            expect(moveInterceptor.deliver.calledWith(moveEvent)).to.equal(true);
          });
        });
      });
    });

    describe('when recording is false', function() {
      beforeEach(function() {
        sut.stop();

        sut.activeInterceptors[0].waitingFor = 'click';
        sut.activeInterceptors[0].deliver = sinon.spy();
      });

      it('a click interceptor does not receive click events', function() {
        sut.eventListener(clickEvent);

        expect(sut.activeInterceptors[0].deliver.calledWith(clickEvent)).to.equal(false);
      });
    });
  });

  describe('#record', function() {
    it('marks the bus as recording', function() {
      var sut = new EventBus([ FakeInterceptor ], new FakeBuffer());
      sut.record();

      expect(sut.recording).to.equal(true);
    });

    it('opens the buffer', function() {
      var sut = new EventBus([ FakeInterceptor ], new FakeBuffer());
      sut.buffer.open = sinon.spy();

      sut.record();
      expect(sut.buffer.open.called).to.equal(true);
    });
  });

  describe('#stop', function() {
    it('marks the bus as not recording', function() {
      var sut = new EventBus([ FakeInterceptor ], new FakeBuffer());
      sut.record();

      sut.stop();

      expect(sut.recording).to.equal(false);
    });

    it('closes the buffer', function() {
      var sut = new EventBus([ FakeInterceptor ], new FakeBuffer());
      sut.buffer.close = sinon.spy();

      sut.stop();

      expect(sut.buffer.close.called).to.equal(true);
    });

    it('returns the buffer.close return value', function() {
      var sut = new EventBus([ FakeInterceptor ], new FakeBuffer());

      expect(sut.stop()).to.equal('promise');
    });
  });
});
