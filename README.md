backend.js
==========

> No API? No problem!

Based on AngularJS's `$httpBackend`, backend.js allows you to mock API responses in the browser. Written in vanilla JavaScript, it has 0 dependancies, so you should be able to use it in combination with any library and/or framework.

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
Looking for some alternatively syntax? Well, it's your day, because backend.js is a rule breaker!
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
