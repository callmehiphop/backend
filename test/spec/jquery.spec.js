var backend = require('../../index');

describe('backend + jQuery', function () {

  afterEach(function () {
    backend.clear();
  });

  it('should hit an end point when a stub does not exist', function (done) {
    $.getJSON('fixtures/data.json').then(function (response) {
      done(new Error('request should have not succeeded but it did'));
    }, function(_, __, error) {
      error.message.should.equal('Unexpected request: GET fixtures/data.json');
      done();
    });
  });

  it('should serve up a stub when a stub exists', function (done) {
    backend.when('GET', 'fixtures/data.json').respond({
      test: 'I AM THE MACHO MAN!'
    });

    $.getJSON('fixtures/data.json', function (response) {
      response.should.be.a('object');
      response.test.should.equal('I AM THE MACHO MAN!');
      done();
    });
  });

  it('should hit an end point when a stub does exist but headers do not match', function (done) {
    backend.when('GET', 'fixtures/data.json', undefined, {
      'X-test': 'correct'
    }).respond({
      test: 'I AM THE MACHO MAN!'
    });

    $.ajax({
      dataType: "json",
      url: 'fixtures/data.json',
      headers: {
        'X-test': 'wrong'
      },
      success: function (response) {
        done(new Error('request should have not succeeded but it did'));
      },
      error: function(_, __, error) {
        error.message.should.equal('Unexpected request: GET fixtures/data.json');
        done();
      }
    });
  });

  it('should serve up a stub when a stub exists and headers match', function (done) {
    backend.when('GET', 'fixtures/data.json', undefined, {
      'X-test': 'correct'
    }).respond({
      test: 'I AM THE MACHO MAN!'
    });

    $.ajax({
      dataType: "json",
      url: 'fixtures/data.json',
      headers: {
        'X-test': 'correct'
      },
      success: function (response) {
        response.should.be.a('object');
        response.test.should.equal('I AM THE MACHO MAN!');
        done();
      }
    });
  });

  it('should handle failed requests', function (done) {
    backend.when('GET', 'fixtures/*.json').respond(500, {
      error: 'nope nope nope!'
    });

    $.getJSON('fixtures/fail.json').error(function (response) {
      response.status.should.equal(500);
      response.responseJSON.should.eql({
        error: 'nope nope nope!'
      });
      done();
    });
  });

});
