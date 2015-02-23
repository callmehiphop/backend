# backend.js

> No API? No problem!

## The *What*

Based on AngularJS's $httpBackend, backend.js allows you to mock API responses
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

Then use XHR per usual:

```javascript
var xhr = new XMLHttpRequest();

xhr.onreadystatechange = function () {
  if (this.readyState === 4 && this.status === 200) {
    var data = JSON.parse(xhr.responseText);
    var msg = '<p>Hello, ' + data.name + ' the ' + data.species + '</p>';

    document.body.innerHTML += msg;
  }
};

xhr.open('GET', '/api/users/jake');
xhr.send();
```

It also plays nicely with jQuery, so if VanillaJS isn't your thing, that's ok!

```javascript
$.getJSON('/api/users/jake', function (response) {
  $('body').append('<p>Hello, ' + response.name + ' the ' + response.species + '</p>');
});
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

## License

MIT license
