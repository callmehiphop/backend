var backend = require('../../index');

describe('expectations', function () {

  afterEach(function () {
    backend.clear();
  });

  it('should work as expected when requested exactly once', function (done) {
    backend.expectGET('fixtures/data.json').respond({
      test: 'I AM THE MACHO MAN!'
    });

    $.getJSON('fixtures/data.json', function (response) {
      response.should.be.a('object');
      response.test.should.equal('I AM THE MACHO MAN!');
      done();
    });

    backend.verifyNoOutstandingExpectation();
  });

  it('should work as expected with a mix of expectations and regular mocks', function (done) {
    backend.expect('GET', 'fixtures/foo.json').respond({
      test: 'foo'
    });

    backend.when('GET', 'fixtures/bar.json').respond({
      test: 'bar'
    });

    $.getJSON('fixtures/foo.json', function (response) {
      response.should.be.a('object');
      response.test.should.equal('foo');
      $.getJSON('fixtures/bar.json', function (response) {
        response.should.be.a('object');
        response.test.should.equal('bar');
        backend.verifyNoOutstandingExpectation();
        done();
      });
    });

  });

  it('should throw when verifying outstanding expectations if some were not fulfilled', function (done) {
    backend.expect('GET', 'fixtures/foo.json').respond({
      test: 'foo'
    });
    backend.when('GET', 'fixtures/bar.json').respond({
      test: 'bar'
    });
    backend.expectPOST('api/bas', { theanswer: 42 }).respond({
      test: 'bas'
    });

    $.getJSON('fixtures/foo.json', function (response) {
      response.should.be.a('object');
      response.test.should.equal('foo');
      $.getJSON('fixtures/bar.json', function (response) {
        response.should.be.a('object');
        response.test.should.equal('bar');

        try {
          backend.verifyNoOutstandingExpectation();
          done(new Error('No exceptions were thrown'));
        } catch (e) {
          e.should.be.instanceof(Error);
          e.message.should.equal('Expected no outstanding expectations, but there were 1\n' +
            '(expecting) POST /^api\\/bas$/\n{"theanswer":42}');
          done();
        }
      });
    });
  });

  it('should throw when a second attempt is made for an expectation', function (done) {
    backend.expectGET('fixtures/data.json').respond({
      test: 'just once'
    });

    $.getJSON('fixtures/data.json', function (response) {
      response.should.be.a('object');
      response.test.should.equal('just once');

      $.getJSON('fixtures/data.json').then(function () {
        done(new Error('request succeeded when it should not have'));
      }, function(_, __, error) {
        error.message.should.equal('Unexpected request: GET fixtures/data.json');
        backend.verifyNoOutstandingExpectation();
        done();
      });
    });
  });
});