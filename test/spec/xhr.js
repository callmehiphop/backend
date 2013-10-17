describe('Fake XHR', function() {

  var xhr;


  beforeEach(function() {
    xhr = new XMLHttpRequest();
  });


  describe('Using Fake XHR via Vanilla JavaScript', function() {

    it('should attempt to hit end point when mock does not exist', function() {
      var response;
      
      xhr.onreadystatechange = function() {
        response = this.response;
      };
      xhr.open('GET', 'misc/data.json', false);
      xhr.send();

      expect(response).to.be.a('string');
      response = JSON.parse(response);
      expect(response).to.be.a('object');
      expect(response.test).to.equal('hi');
    });

  });


  describe('Using Fake XHR via jQuery', function() {

    it('should attempt to hit end point when mock does not exist', function() {
      // synchronous request
      $.ajax({
        async: false,
        dataType: 'json',
        url: 'misc/data.json'
      }).done(function(response) {
        expect(response).to.be.a('object');
        expect(response.test).to.equal('hi');
      });

      // asynchronous request
      $.getJSON('misc/data.json', function(response) {
        expect(response).to.be.a('object');
        expect(response.test).to.equal('hi');
      });
    });

  });

});