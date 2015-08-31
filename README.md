# backend.js

> No API? No problem!

[![Travis Build Status](https://travis-ci.org/callmehiphop/backend.svg?branch=master)](https://travis-ci.org/callmehiphop/backend)

## The *What*

Based on AngularJS's [$httpBackend](https://docs.angularjs.org/api/ngMock/service/$httpBackend), backend.js allows you to mock API responses
in the browser. Written in vanilla JavaScript, it has 0 dependencies, so you
should be able to use it in combination with any library and/or framework.

backend.js does not require any configurations. Simply drop the script in and
start mocking up some responses. It works by monkey patching the XMLHttpRequest
constructor, allowing all requests to be intercepted. If a request is made and a
mocked response is found, backend.js simply serves up that response.
Alternatively, if no mocked response is found, then the real XHR object is
called to allow your request to pass through.

## The *Why*

Originally, this project was started out of boredom! Then one day I found a need
to stub responses in Web Workers, so I decided to revisit it and so it is.

## Installation

### npm

```sh
$ npm install --save-dev mocked-backend
```

Then just require it!

```javascript
var backend = require('mocked-backend');
```

**Note:** backend is only intended to be used within a browser, a CJS module format
is available for things like browserify

### bower

```sh
$ bower install --save-dev backend
```

You just need to include the `backend.js` file that comes with the bower install.

## Examples

Stub a response:

```javascript
// supports globbing patterns!
backend.when('GET', '/api/users/*').respond({
  name: 'Jake',
  species: 'Dog',
  magicPowers: true,
  location: 'Ooooo'
});
```

Then use XHR or any AJAX library you wish to do your tests (jQuery with [chai](http://chaijs.com/) should assertions below):

```javascript
$.getJSON('/api/users/jake', function (response) {
  response.name.should.equal('Jake');
  response.species.should.equal('Dog');
});
```

Declare ajax calls you expect in your test and verify they are called ([mocha](https://mochajs.org/) and jQuery shown below):

```javascript
beforeEach(function() {
  backend.expectPOST('/signup', {
    username: 'Bob',
    email: 'bob@gmail.com',
    password: 'password'
  }).respond(200, { userId: 3 })
})

afterEach(function() {
  backend.verifyNoOutstandingExpectation()
})

it('should send a post to /signup when the form is filled out and completed', function() {
  $('form.signup [name="username"]').val('Bob');
  $('form.signup [name="email"]').val('bob@gmail.com');
  $('form.signup [name="password"]').val('password');
  $('form.signup [type="submit"]').click();
})
```

Async requests are delay by default for 100ms however you can specific a different value if you need:

```javascript
backend
  .when('GET', '/api/users/*')
  .options({
    delay: 2000
  })
  .respond({
    name: 'Jake',
    species: 'Dog',
    magicPowers: true,
    location: 'Ooooo'
  });
```

You can also call `backend.flush` to syncrounously resolve any pending requests, and `verifyNoOutstandingRequest` to assert there are no requests in flight.

## License

MIT license
