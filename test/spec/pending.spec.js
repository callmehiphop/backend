var backend = require('../../index');

describe('pending requests', function () {

  afterEach(function () {
    backend.clear();
  });

  describe('verifyNoOutstandingRequest', function() {
    it('should not throw when all requests have been fulfilled', function () {
      var xhr = new XMLHttpRequest();
      var response;

      backend.when('GET', 'fixtures/data.json').respond({
        test: 'toast is the perfect place for jelly to lay'
      });

      xhr.onreadystatechange = function() {
        response = xhr.response;
      };

      xhr.open('GET', 'fixtures/data.json', false);
      xhr.send();

      response.should.be.a('string');
      backend.verifyNoOutstandingRequest();
    });


    it('should throw when there are pending requests', function () {
      backend.expect('GET', 'fixtures/foo.json').respond({
        test: 'foo'
      });

      $.getJSON('fixtures/foo.json', function () {});

      try {
        backend.verifyNoOutstandingRequest();
      } catch (e) {
        e.should.be.instanceof(Error);
        e.message.should.equal('Expected no outstanding requests, but there were 1\n' +
          'GET fixtures/foo.json -> 200');
        return;
      }
      new Error('No exceptions were thrown');
    });
  });

  describe('flush', function() {
    it('should resolve pending requests syncrounously', function() {
      var xhr = new XMLHttpRequest();
      var response = '';

      backend.when('GET', 'fixtures/data.json').respond({
        test: 'toast is the perfect place for jelly to lay'
      });

      xhr.onreadystatechange = function() {
        response = xhr.response;
      };

      xhr.open('GET', 'fixtures/data.json');
      xhr.send();

      response.should.be.empty;
      backend.flush();
      JSON.parse(response).test.should.equal('toast is the perfect place for jelly to lay');
      backend.verifyNoOutstandingRequest();
    });

    it('should clear the timeout and not resolve twice', function(done) {
      var xhr = new XMLHttpRequest();
      var called = 0;

      backend.when('GET', 'greeting').options({ delay: 30 }).respond('hello!');

      xhr.onreadystatechange = function() {
        called++;
      };

      xhr.open('GET', 'greeting');
      xhr.send();

      called.should.equal(0);
      backend.flush();
      called.should.equal(1);
      
      setTimeout(function() {
        called.should.equal(1);
        done();
      }, 50);
    });
  });
});