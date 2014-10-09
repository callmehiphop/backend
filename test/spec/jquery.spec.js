var backend = require('../../index');

describe('backend + jQuery', function () {

  afterEach(function () {
    backend.clear();
  });

  it('should hit an end point when a stub does not exist', function (done) {
    $.getJSON('fixtures/data.json', function(response) {
      response.should.be.a('object');
      response.test.should.equal('hi');
      done();
    });
  });

  it('should serve up a stub when a stub exists', function (done) {
    backend.when('GET', 'fixtures/data.json').respond({
      test: 'I AM THE MACHO MAN!'
    });

    $.getJSON('fixtures/data.json', function(response) {
      response.should.be.a('object');
      response.test.should.equal('I AM THE MACHO MAN!');
      done();
    });
  });

});