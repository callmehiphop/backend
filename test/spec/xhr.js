describe('Fake XHR', function() {

  describe('Using Fake XHR via Vanilla JavaScript', function() {

    var xhr;

    beforeEach(function() {
      mocks.length = 0;
      xhr = new XMLHttpRequest();
    });

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

    it('should serve up mock data when defined', function() {
      var response;

      '/things/:thing'.on('get').respond({ message: 'Toast rules!' });

      xhr.onreadystatechange = function() {
        response = this.response;
      };
      xhr.open('GET', '/things/toast', false);
      xhr.send();

      expect(response).to.be.a('string');
      response = JSON.parse(response);
      expect(response).to.be.a('object');
      expect(response.message).to.equal('Toast rules!');
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

    it('should serve up mock data when defined', function() {
      '/things/:thing'.on('get').respond({ message: 'Toast rules!' });

      $.getJSON('/things/toast', function(response) {
        expect(response).to.be.a('object');
        expect(response.message).to.equal('Toast rules!');
      });
    });

  });

});