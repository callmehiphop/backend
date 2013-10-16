describe('Fake XHR', function() {

  var xhr;

  beforeEach(function() {
    xhr = new XMLHttpRequest();
  });

  it('should attempt to hit end point when mock does not exist', function() {
    var response;
    
    xhr.onreadystatechange = function() {
      response = this.response;
    };
    xhr.open('GET', 'data.json', false);
    xhr.send();

    expect(response).to.be.a('string');
    response = JSON.parse(response);
    expect(response).to.be.a('object');
    expect(response.test).to.equal('hi');
  });

});