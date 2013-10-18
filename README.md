backend.js
==========

> No API? No problem!

Based on AngularJS's `$httpBackend`, backend.js allows you to mock API responses in the browser. 
Written in vanilla JavaScript, it has 0 dependancies, so you should be able to use it in combination with any library and/or framework.

backend.js does not require any configurations, simply drop the script in and start mocking up some responses. 
It works by hijacking the `XMLHttpRequest` constructor, allowing all requests to be intercepted and analyzed.
If a request is made and a mocked response is found, backend.js simply serves up that response. 
Alternatively, if no mocked response is found, then the real XHR object is called to allow your request to pass through.

### Examples
To create a mocked response, simply access the `backend` object.

```javascript
backend.when('GET', '/users/:userid')
  .respond({ 
    name: 'Stephen' 
  });
```
Then once you have your mocked response set, you simply use XHR per usual!
```javascript
var xhr = new XMLHttpRequest();

xhr.open('GET', '/users/stephenplusplus');
xhr.onreadystatechange = function() {
  if (this.readyState == 4) {
    var user = JSON.parse(this.responseText);
    document.body.innerHTML += '<p>Hello, ' + user.name + '</p>'; 
  }
};
xhr.send();
```
backend.js has been tested with jQuery and no changes are necessary for your code to play nicely!
```javascript
$.getJSON('/users/stephenpluplus', function(response) {
  $('body').append('<p>Hello, ' + response.name + '</p>');
});
```
Looking for some alternative syntax? Well, it's your day, because backend.js is a rule breaker! (shoutout to [stephenplusplus](https://github.com/stephenplusplus/)!)
```javascript
'/users/:userid'.on('get')
  .respond({
    authId: 9999,
    firstName: 'Jello',
    lastName: 'Biafra'
  });
  
'/things/:thing'.on('post', { thing: 'toast' })
  .respond({
    message: 'Toast is the perfect place for jelly to lay'
  });
```
