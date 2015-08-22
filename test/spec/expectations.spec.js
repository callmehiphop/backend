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
    backend.expect('GET', 'fixtures/data.json').respond({
      test: 'I AM THE MACHO MAN!'
    });

    try {
      backend.verifyNoOutstandingExpectation();
      done(new Error('No exceptions were thrown'));
    } catch (e) {
      e.should.be.instanceof(Error);
      e.message.should.equal('Expected no outstanding expectations, but there were 1\n(expecting) GET /^fixtures\\/data\\.json$/');
      done();
    }
  });

});