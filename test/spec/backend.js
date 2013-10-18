describe('Backend API', function() {


  var response = { data: 'hi' };


  beforeEach(resetMocks);


  describe('#when()', function() {

    beforeEach(resetMocks);

    it('should create a new mock object when called', function() {
      backend.when('GET', '/things').respond(response);
      expect(mocks.length).to.equal(1);
      backend.when('GET', '/otherThings').respond(response);
      expect(mocks.length).to.equal(2);
      backend.when('POST', '/things').respond(response);
      expect(mocks.length).to.equal(3);
    });

  });


  describe('#respond()', function() {

    it('should store a response after calling #respond()', function() {
      backend.when('GET', '/things').respond(404, response, 'hi');
      expect(mocks[0].response).to.be.a('object');
      expect(mocks[0].response).to.eql({ status: 404, data: response, headers: 'hi'});
    });

    it('should add a 200 status when no status is set', function() {
      backend.when('GET', '/things').respond(response, 'hi');
      expect(mocks[0].response).to.eql({ status: 200, data: response, headers: 'hi'});
    });

  });


  describe('#get()', function() {

    beforeEach(resetMocks);

    it('should create a new mock object when called', function() {
      backend.get('/things').respond(response);
      expect(mocks.length).to.equal(1);
    });

    it('should set the mock method to "GET"', function() {
      backend.get('/things').respond(response);
      expect(mocks[0].method).to.equal('GET');
    });

  });


  describe('#post()', function() {

    beforeEach(resetMocks);

    it('should create a new mock object when called', function() {
      backend.post('/things').respond(response);
      expect(mocks.length).to.equal(1);
    });

    it('should set the mock method to "POST"', function() {
      backend.post('/things').respond(response);
      expect(mocks[0].method).to.equal('POST');
    });

  });


  describe('#put()', function() {

    beforeEach(resetMocks);

    it('should create a new mock object when called', function() {
      backend.put('/things').respond(response);
      expect(mocks.length).to.equal(1);
    });

    it('should set the mock method to "PUT"', function() {
      backend.put('/things').respond(response);
      expect(mocks[0].method).to.equal('PUT');
    });

  });


  describe('#delete()', function() {

    beforeEach(resetMocks);

    it('should create a new mock object when called', function() {
      backend.delete('/things').respond(response);
      expect(mocks.length).to.equal(1);
    });

    it('should set the mock method to "DELETE"', function() {
      backend.delete('/things').respond(response);
      expect(mocks[0].method).to.equal('DELETE');
    });

  });


  describe('#patch()', function() {

    beforeEach(resetMocks);

    it('should create a new mock object when called', function() {
      backend.patch('/things').respond(response);
      expect(mocks.length).to.equal(1);
    });

    it('should set the mock method to "PATCH"', function() {
      backend.patch('/things').respond(response);
      expect(mocks[0].method).to.equal('PATCH');
    });

  });


  describe('#jsonp()', function() {

    beforeEach(resetMocks);

    it('should create a new mock object when called', function() {
      backend.jsonp('/things').respond(response);
      expect(mocks.length).to.equal(1);
    });

    it('should set the mock method to "JSONP"', function() {
      backend.jsonp('/things').respond(response);
      expect(mocks[0].method).to.equal('JSONP');
    });

  });


  describe('#on()', function() {

    beforeEach(resetMocks);

    it('should create a new mock object when called', function() {
      '/things'.on('get').respond(response);
      expect(mocks.length).to.equal(1);
    });

    it('should make a regular expression out of the used string', function() {
      var route = '/things/:thing';
      route.on('get').respond(response);
      expect(mocks[0].url).to.be.an.instanceof(RegExp);
      expect(mocks[0].url.test(route)).to.be.true;
    });

  });

});