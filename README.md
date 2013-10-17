backend
=======

> Similar to AngularJS's $httpBackend, this allows you to mock HTTP responses. Great for unit tests and parallel development!

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
