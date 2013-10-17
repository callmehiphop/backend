describe('Mock Object', function() {

  var method = 'get';
  var url = '/users/:user/name';

  var data = {
    username: 'Jello',
    password: 'Biafra'
  };

  var headers = {
    'x-token': 'xyz'
  };

  var mock = new Mock(method, url, data, headers);


  describe('Mock Constructor', function() {

    it('should transform the request type to uppercase', function() {
      expect(mock.method).to.equal('GET');
    });
    
    it('should transform the url to a regular expression', function() {
      expect(mock.url.test).to.be.a('function');
    });

    it('should store a reference to the data object', function() {
      expect(mock.data).to.equal(data);  
    });
    
    it('should store a reference to the headers object', function() {
      expect(mock.headers).to.equal(headers);
    });
    
  });


  describe('#match()', function() {

    it('should return true when a match is made', function() {
      expect(mock.match(method, url, data, headers)).to.be.true;
    });

    it('should return false when the request type is different', function() {
      expect(mock.match('post', url, data, headers)).to.be.false;
    });

    it('should return false when the routes do not match', function() {
      expect(mock.match(method, '/users/name', data, headers)).to.be.false;
    });

    it('should return false when the params do not match', function() {
      expect(mock.match(method, url, { test: 'hi' }, headers)).to.be.false;
    });

    it('should return false when the headers do not match', function() {
      expect(mock.match(method, url, data, { 'y-token': 'xyz' })).to.be.false;
    });

  });


  describe('routeToRegExp()', function() {

    it('should turn a string into a regular expression', function() {
      expect(routeToRegExp('/hi')).to.be.an.instanceof(RegExp);
    });

    it('should accept dynamic routes and match them accordingly', function() {
      var route = routeToRegExp('/users/:user/name');
      expect(route.test('/users/tom/name')).to.be.true;
      expect(route.test('/users/user/name')).to.be.true;
      expect(route.test('/users/91242/name')).to.be.true;
      expect(route.test('/users/name')).to.be.false;
      expect(route.test('/users/tom/name/first')).to.be.false;
      expect(route.test('/people/users/tom/name')).to.be.false;
    });

  });

});