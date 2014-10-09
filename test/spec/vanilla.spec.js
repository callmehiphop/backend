var expect = require('chai').expect;
var backend = require('../../index');

describe('backend with vanillajs', function() {

  afterEach(function () {
    backend.clear();
  });

  it('should attempt to hit end point when mock does not exist', function() {
    var xhr = new XMLHttpRequest();
    var response;

    xhr.onreadystatechange = function() {
      response = xhr.response;
    };

    xhr.open('GET', 'fixtures/data.json', false);
    xhr.send();

    response.should.be.a('string');
    response = JSON.parse(response);
    response.should.be.a('object');
    response.test.should.equal('hi');
  });

  it('should serve up mock data when defined', function() {
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
    response = JSON.parse(response);
    response.should.be.a('object');
    response.test.should.equal('toast is the perfect place for jelly to lay');
  });

  it('should handle async requests in an async fashion', function (done) {
    var xhr = new XMLHttpRequest();
    var response;

    backend.when('GET', 'fixtures/data.json').respond({
      test: 'oh my glob'
    });

    xhr.onreadystatechange = function () {
      response = JSON.parse(xhr.responseText);
      response.should.be.a('object');
      response.test.should.equal('oh my glob');
      done();
    };

    xhr.open('GET', 'fixtures/data.json', true);
    xhr.send();

    expect(response).not.to.exist;
  });

});