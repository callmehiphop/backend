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
      xhr.open('GET', 'fixtures/data.json', false);
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
      var data;

      // synchronous request
      $.ajax({
        async: false,
        dataType: 'json',
        url: 'fixtures/data.json'
      }).done(function(response) {
        expect(response).to.be.a('object');
        expect(response.test).to.equal('hi');
      });

      // asynchronous request
      $.getJSON('fixtures/data.json', function(response) {
        expect(response).to.be.a('object');
        expect(response.test).to.equal('hi');
      });

    });

    it('should serve up mock data when defined', function() {
      var data;

      '/things/:thing'.on('get').respond({ message: 'Toast rules!' });

      $.getJSON('/things/toast', function(response) {
        expect(response).to.be.a('object');
        expect(response.message).to.equal('Toast rules!');
      });

      '/things/:thing'.on('post', { key: 'value' }).respond({ yee: 'haw' });

      $.post('/things/cowboy', { key: 'value' }, function(response) {
        expect(response).to.be.a('string');
        response = JSON.parse(response);
        expect(response).to.be.a('object');
        expect(response.yee).to.equal('haw');
      });

      '/things/:thing'.on('delete', { id: 'Bob' }, { 'x-auth-token': 'awwwyeah' })
        .respond({ message: 'What\'s the matter with Bob?' });

      $.ajax({
        method: 'DELETE',
        dataType: 'json',
        url: '/things/users',
        data: { id: 'Bob' },
        headers: { 'x-auth-token': 'awwwyeah' }
      }).done(function(response) {
        expect(response).to.be.a('object');
        expect(response.message).to.equal('What\'s the matter with Bob?');
      });
    });

  });

});