describe('Helper Functions', function() {

  // setup..
  var thing = function() {
    this.yep = 'value';
    this.maybe = function() {};
  };

  thing.prototype.nope = function() {};
  thing.prototype.wurt = 'hi';


  // and away we go!
  describe('each()', function() {

    it('should fire a callback for each item in the array', function() {
      var i = 0;
      each([1, 2, 3], function() {
        i += 1;
      });
      expect(i).to.equal(3);
    });

    it('should pass in the value of the current iteration into the callback', function() {
      var sum = 0;
      each([1, 2, 3], function(value) {
        sum += value;
      });
      expect(sum).to.equal(6);
    });

    it('should pass in the index of the current iteration into the callback', function() {
      var counter = 0;
      each([1, 2, 3, 4, 'cat'], function(value, i) {
        expect(counter++).to.equal(i);
      });
    });

    it('should pass in the array being iterated over into the callback', function() {
      var things = ['cat', 3, {}, false];
      each(things, function(thing, i, stuff) {
        expect(stuff).to.equal(things);
      });
    });

    it('should break the loop if the callback returns false', function() {
      var iterations = 0;
      each([1, 2, 3], function(value, i) {
        iterations += 1;
        return i !== 1;
      });
      expect(iterations).to.equal(2);
    });

    it('should change the context of "this" when specified', function() {
      var context = { test: 'Hello!' };
      each([1, 2, 3], function() {
        expect(this).to.equal(context);
      }, context);
    });

  });


  describe('extend()', function() {

    var target;

    beforeEach(function() {
      target = {};
    });

    it('should perform a shallow copy of one object to another', function() {
      var obj = { hello: 'world', test: { hello: 'goodbye' } };
      extend(target, obj);
      expect(target.hello).to.equal('world');
      expect(target).to.not.equal(obj);
      expect(target.test).to.equal(obj.test);
    });

    it('should copy an ifinite number of objects', function() {
      extend(target, { hello: 'goodbye' }, { test: true }, { sum: 17 }, { method: function() {} });

      expect(target.hello).to.equal('goodbye');
      expect(target.test).to.be.true;
      expect(target.sum).to.equal(17);
      expect(target.method).to.be.a('function');
    });

    it('should let the last object with a certain property name take precedence', function() {
      extend(target, { hello: 'world' }, { hello: 'goodbye'});
      expect(target.hello).to.equal('goodbye');
    });

    it('should return a the target object upon completion', function() {
      var result = extend(target, { yee: 'haw' });
      expect(result).to.equal(target);
    });

  });

  
  describe('has()', function() {

    it('should check if the supplied object has the supplied key', function() {
      expect(has(new thing, 'yep')).to.be.true;
      expect(has(new thing, 'maybe')).to.be.true;
      expect(has(new thing, 'nope')).to.be.false;
      expect(has(new thing, 'wurt')).to.be.false;
      expect(has(new thing, 'what!')).to.be.false;
    });

  });


  describe('pick()', function() {

    var things = {
      'roses': 'red',
      'violets': 'blue',
      'all our base': 'belong to you',
      'yep': 'nope'
    };

    it('should create a new object, copying the values specified by the keys array', function() {
      var result = pick(things, ['roses', 'violets']);
      expect(result.roses).to.equal('red');
      expect(result.violets).to.equal('blue');
      expect(result['all our base']).to.be.undefined;
      expect(result.yep).to.be.undefined;
    });

  });


  describe('props()', function() {

    it('should only pull out non-function values', function() {
      var result = props(new thing);
      expect(result.yep).to.equal('value');
      expect(result.maybe).to.be.undefined;
      expect(result.nope).to.be.undefined;
      expect(result.wurt).to.equal('hi');
    });

    it('should not grab any falsey values when second arg is set to true', function() {
      var test = {
        f: false,
        n: null,
        str: '',
        num: 0,
        pass: 'yay'  
      };

      // should pull falseys
      var result = props(test);
      expect(result.f).to.be.false;
      expect(result.n).to.be.null;
      expect(result.str).to.be.a('string');
      expect(result.str).to.equal('');
      expect(result.num).to.be.a('number');
      expect(result.num).to.equal(0);
      expect(result.pass).to.equal('yay');

      // shouldn't pull falseys
      result = props(test, true);
      expect(result.f).to.be.undefined;
      expect(result.n).to.be.undefined;
      expect(result.str).to.be.undefined;
      expect(result.num).to.be.undefined;
      expect(result.pass).to.equal('yay');
    });

  });


  describe('#apply()', function() {

    var context = {
      doSomething: function() {
        return {
          context: this,
          args: arguments
        };
      }  
    };

    it('should bind the first argument passed in as the context', function() {
      expect(apply(context, 'doSomething').context).to.equal(context);
    });

  });


  describe('#keys()', function() {

    var Person = function(name, age) {
      this.name = name;
      this.age = age;
    };

    Person.prototype.greet = function() {
      return 'Hello, my name is ' + this.name;
    };

    it('should return ALL keys of a given object', function() {
      expect(keys(new Person('Dave', 27))).to.eql(['name', 'age', 'greet']);
      expect(keys({ hello: 'goodbye' })).to.eql(['hello']);
    });

  });


  describe('#merge()', function() {

    var array1 = ['cat', 'brown', 7, 'toast'];
    var array2 = ['dog', 'blue', 'toast', 9];

    it('should sort and merge two arrays, ignoring duplicate values', function() {
      expect(merge(array1, array2)).to.eql([7, 9, 'blue', 'brown', 'cat', 'dog', 'toast']);
    });

  });


  describe('#equals()', function() {

    it('should do a strict comparison of normal data types', function() {
      expect(equals(2, 2)).to.be.true;
      expect(equals(2, '2')).to.be.false;
      expect(equals('hi', 'hi')).to.be.true;
      expect(equals('hi', 'bye')).to.be.false;
      expect(equals()).to.be.true; // undefined x 2
      expect(equals(false, false)).to.be.true;
      expect(equals(true, false)).to.be.false;
    });

    it('should do a comparison between two object', function() {
      var a = { test: 'hi', test2: 'bye' };
      var b = { test: 'hi', test2: 'bye' };
    
      expect(equals(a, b)).to.be.true;

      b.test = 'nupe';
      expect(equals(a, b)).to.be.false;
    });

    it('should do a deep comparison between two complex object', function() {
      var a = { test: 'hi', test2: { test3: 'bye', test4: { test5: 'make it stop' } } };
      var b = { test: 'hi', test2: { test3: 'bye', test4: { test5: 'make it stop' } } };

      expect(equals(a, b)).to.be.true;

      a.test2.test4.test5 = 'never!';
      expect(equals(a, b)).to.be.false;
    });

  });


});